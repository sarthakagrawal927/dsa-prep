import { useState, useCallback } from 'react';

export function useCodeExecution() {
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const execute = useCallback((code, testCases) => {
    setIsRunning(true);
    setOutput('');
    setErrors(null);
    setTestResults([]);

    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox = 'allow-scripts';

      // Build the code to run inside the iframe
      const testCasesJSON = JSON.stringify(testCases || []);

      // Extract function name from user code
      const funcMatchRegex = `
        const funcMatches = userCode.match(/function\\s+(\\w+)/g);
        let funcName = null;
        if (funcMatches) {
          const m = funcMatches[0].match(/function\\s+(\\w+)/);
          funcName = m ? m[1] : null;
        }
        if (!funcName) {
          const arrowMatch = userCode.match(/(?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:\\(|function)/);
          funcName = arrowMatch ? arrowMatch[1] : null;
        }
      `;

      const html = `<!DOCTYPE html><html><body><script>
        const logs = [];
        console.log = function() {
          const args = Array.from(arguments);
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
        };
        console.error = function() { logs.push('ERROR: ' + Array.from(arguments).map(String).join(' ')); };
        console.warn = function() { logs.push('WARN: ' + Array.from(arguments).map(String).join(' ')); };
        console.info = function() { logs.push('INFO: ' + Array.from(arguments).map(String).join(' ')); };

        try {
          const userCode = ${JSON.stringify(code)};
          eval(userCode);

          const testCases = ${testCasesJSON};
          ${funcMatchRegex}

          const results = testCases.map(function(tc) {
            try {
              if (funcName) {
                const argsStr = JSON.stringify(tc.args);
                const result = eval(funcName + '(...' + argsStr + ')');
                const passed = JSON.stringify(result) === JSON.stringify(tc.expected);
                return { args: tc.args, expected: tc.expected, description: tc.description, actual: result, passed: passed };
              }
              return { args: tc.args, expected: tc.expected, description: tc.description, actual: null, passed: false, error: 'No function found' };
            } catch(e) {
              return { args: tc.args, expected: tc.expected, description: tc.description, actual: null, passed: false, error: e.message };
            }
          });

          parent.postMessage({ type: 'exec-result', output: logs.join('\\n'), errors: null, testResults: results }, '*');
        } catch(e) {
          parent.postMessage({ type: 'exec-result', output: logs.join('\\n'), errors: e.message, testResults: [] }, '*');
        }
      </script></body></html>`;

      let timeout;

      const handler = (event) => {
        if (event.data?.type === 'exec-result') {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          document.body.removeChild(iframe);

          const { output: out, errors: err, testResults: results } = event.data;
          setOutput(out || '');
          setErrors(err);
          setTestResults(results || []);
          setIsRunning(false);
          resolve({ output: out, errors: err, testResults: results });
        }
      };

      window.addEventListener('message', handler);

      // Timeout after 5 seconds
      timeout = setTimeout(() => {
        window.removeEventListener('message', handler);
        if (iframe.parentNode) document.body.removeChild(iframe);
        setErrors('Execution timed out (5s limit)');
        setIsRunning(false);
        resolve({ output: '', errors: 'Execution timed out (5s limit)', testResults: [] });
      }, 5000);

      document.body.appendChild(iframe);
      iframe.srcdoc = html;
    });
  }, []);

  const clearOutput = useCallback(() => {
    setOutput('');
    setErrors(null);
    setTestResults([]);
  }, []);

  return { execute, output, errors, testResults, isRunning, clearOutput };
}
