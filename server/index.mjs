import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3456;

// CLI tool configurations — tested against actual CLI interfaces
const CLI_TOOLS = {
  claude: {
    command: 'claude',
    buildArgs: (systemPrompt) => {
      const args = ['-p', '--output-format', 'stream-json', '--verbose'];
      if (systemPrompt) args.push('--system-prompt', systemPrompt);
      return args;
    },
    inputMode: 'stdin',
    embedSystemPrompt: false,
    parseStream: (line, emit) => {
      const json = JSON.parse(line);
      if (json.type === 'assistant' && json.message?.content) {
        for (const block of json.message.content) {
          if (block.type === 'text' && block.text) emit(block.text);
        }
        return;
      }
      if (json.type === 'content_block_delta' && json.delta?.text) {
        emit(json.delta.text);
      }
    },
  },

  codex: {
    // codex exec --json outputs JSONL with item.completed events
    command: 'codex',
    buildArgs: () => ['exec', '--json'],
    inputMode: 'stdin',
    embedSystemPrompt: true,
    parseStream: (line, emit) => {
      const json = JSON.parse(line);
      // codex outputs: {"type":"item.completed","item":{"type":"agent_message","text":"..."}}
      if (json.type === 'item.completed' && json.item?.type === 'agent_message' && json.item.text) {
        emit(json.item.text);
      }
    },
  },

  gemini: {
    // gemini CLI outputs plain text to stdout, no JSON streaming
    command: 'gemini',
    buildArgs: () => [],
    inputMode: 'arg',
    embedSystemPrompt: true,
    parseStream: null, // plain text mode — no JSON parsing
  },
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', tools: Object.keys(CLI_TOOLS) });
});

app.post('/api/chat', (req, res) => {
  const { messages, systemPrompt, tool, provider } = req.body;
  const toolName = provider || tool || 'claude';

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const cliTool = CLI_TOOLS[toolName];
  if (!cliTool) {
    return res.status(400).json({ error: `Unknown provider: ${toolName}. Available: ${Object.keys(CLI_TOOLS).join(', ')}` });
  }

  // Build prompt — embed system prompt for tools that don't have a dedicated flag
  let prompt = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');

  if (cliTool.embedSystemPrompt && systemPrompt) {
    prompt = `System instructions: ${systemPrompt}\n\n${prompt}`;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const args = cliTool.buildArgs(systemPrompt);
  if (cliTool.inputMode === 'arg') args.push('-p', prompt);

  const proc = spawn(cliTool.command, args, {
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  if (cliTool.inputMode === 'stdin') {
    proc.stdin.write(prompt);
    proc.stdin.end();
  }

  let buffer = '';
  let textSent = false;
  const isPlainText = !cliTool.parseStream;

  proc.stdout.on('data', (data) => {
    if (isPlainText) {
      // Plain text mode — forward stdout chunks directly
      const text = data.toString();
      if (text) {
        textSent = true;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
      return;
    }

    // JSON streaming mode
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        cliTool.parseStream(line, (text) => {
          textSent = true;
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        });
      } catch {
        // Non-JSON line — emit as plain text if it doesn't look like JSON
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
          textSent = true;
          res.write(`data: ${JSON.stringify({ text: trimmed + '\n' })}\n\n`);
        }
      }
    }
  });

  proc.stderr.on('data', (data) => {
    const errText = data.toString().trim();
    if (errText) console.error(`[${toolName} stderr]`, errText);
  });

  proc.on('close', (code) => {
    // Flush remaining buffer
    if (buffer.trim()) {
      if (isPlainText) {
        res.write(`data: ${JSON.stringify({ text: buffer.trim() })}\n\n`);
      } else {
        try {
          cliTool.parseStream(buffer, (text) => {
            textSent = true;
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          });
        } catch {
          if (!textSent) {
            res.write(`data: ${JSON.stringify({ text: buffer.trim() })}\n\n`);
          }
        }
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
    if (code !== 0) console.error(`[${toolName}] exited with code ${code}`);
  });

  proc.on('error', (err) => {
    console.error(`[${toolName} spawn error]`, err.message);
    res.write(`data: ${JSON.stringify({ error: `Failed to start ${toolName} CLI. Is it installed?` })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  });

  res.on('close', () => {
    if (!proc.killed) proc.kill('SIGTERM');
  });
});

app.listen(PORT, () => {
  console.log(`Local CLI server running on http://localhost:${PORT}`);
  console.log(`Supported tools: ${Object.keys(CLI_TOOLS).join(', ')}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
