import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProblems } from '../hooks/useProblems';
import {
  Link2,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export default function ImportProblem() {
  const navigate = useNavigate();
  const { patterns, addCustomProblem } = useProblems();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    leetcodeNumber: '',
    difficulty: 'Medium',
    pattern: 'array-hashing',
    description: '',
    starterCode: 'function solution() {\n  // Your code here\n  \n}',
    steps: [
      { title: 'Understand the Problem', hint: '', approach: '', code: '', complexity: '' },
      { title: 'Brute Force Approach', hint: '', approach: '', code: '', complexity: '' },
      { title: 'Optimal Approach', hint: '', approach: '', code: '', complexity: '' },
    ],
    testCases: [{ args: '', expected: '', description: '' }],
    ankiCards: [{ front: '', back: '' }],
  });

  const [imported, setImported] = useState(false);

  const parseSlug = (leetcodeUrl) => {
    const match = leetcodeUrl.match(/leetcode\.com\/problems\/([^/]+)/);
    return match ? match[1] : null;
  };

  const handleFetch = async () => {
    const slug = parseSlug(url);
    if (!slug) {
      setError('Invalid LeetCode URL. Example: https://leetcode.com/problems/two-sum/');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const query = {
        query: `query getQuestionDetail($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            title
            difficulty
            content
            codeSnippets { lang langSlug code }
            exampleTestcaseList
          }
        }`,
        variables: { titleSlug: slug },
      };

      const res = await fetch(CORS_PROXY + encodeURIComponent('https://leetcode.com/graphql'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      const q = data?.data?.question;

      if (!q) throw new Error('Problem not found');

      // Strip HTML tags from content
      const desc = q.content
        ? q.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim()
        : '';

      const jsSnippet = q.codeSnippets?.find(s => s.langSlug === 'javascript');

      setForm(prev => ({
        ...prev,
        title: q.title || prev.title,
        leetcodeNumber: q.questionId || prev.leetcodeNumber,
        difficulty: q.difficulty || prev.difficulty,
        description: desc || prev.description,
        starterCode: jsSnippet?.code || prev.starterCode,
      }));

      setImported(true);
    } catch (e) {
      // Fallback: extract what we can from the slug
      const titleFromSlug = slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      setForm(prev => ({
        ...prev,
        title: titleFromSlug,
      }));

      setError('Could not auto-fetch from LeetCode (CORS). Title extracted from URL — fill in the rest manually.');
      setImported(true);
    } finally {
      setLoading(false);
    }
  };

  const updateStep = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }));
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [...prev.steps, { title: '', hint: '', approach: '', code: '', complexity: '' }],
    }));
  };

  const removeStep = (idx) => {
    setForm(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== idx) }));
  };

  const updateTestCase = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      testCases: prev.testCases.map((t, i) => i === idx ? { ...t, [field]: value } : t),
    }));
  };

  const addTestCase = () => {
    setForm(prev => ({
      ...prev,
      testCases: [...prev.testCases, { args: '', expected: '', description: '' }],
    }));
  };

  const removeTestCase = (idx) => {
    setForm(prev => ({ ...prev, testCases: prev.testCases.filter((_, i) => i !== idx) }));
  };

  const updateAnkiCard = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      ankiCards: prev.ankiCards.map((c, i) => i === idx ? { ...c, [field]: value } : c),
    }));
  };

  const addAnkiCard = () => {
    setForm(prev => ({
      ...prev,
      ankiCards: [...prev.ankiCards, { front: '', back: '' }],
    }));
  };

  const removeAnkiCard = (idx) => {
    setForm(prev => ({ ...prev, ankiCards: prev.ankiCards.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `custom-${slug}`;

    // Parse test cases — user enters JSON arrays
    const testCases = form.testCases
      .filter(t => t.args.trim())
      .map(t => {
        try {
          return {
            args: JSON.parse(t.args),
            expected: JSON.parse(t.expected),
            description: t.description,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const ankiCards = form.ankiCards
      .filter(c => c.front.trim() && c.back.trim())
      .map((c, i) => ({ id: `${id}-card-${i}`, front: c.front, back: c.back }));

    const steps = form.steps
      .filter(s => s.title.trim())
      .map(s => {
        const step = { title: s.title };
        if (s.hint) step.hint = s.hint;
        if (s.approach) step.approach = s.approach;
        if (s.code) step.code = s.code;
        if (s.complexity) step.complexity = s.complexity;
        return step;
      });

    const problem = {
      id,
      title: form.title,
      difficulty: form.difficulty,
      pattern: form.pattern,
      leetcodeUrl: url || `https://leetcode.com/problems/${slug}/`,
      leetcodeNumber: parseInt(form.leetcodeNumber) || 0,
      description: form.description,
      starterCode: form.starterCode,
      steps,
      testCases,
      ankiCards,
    };

    addCustomProblem(problem);
    navigate(`/problem/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Import Problem</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-400">
          Paste a LeetCode URL to auto-fill, then customize the breakdown.
        </p>
      </div>

      {/* URL Input */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
        <label className="mb-2 block text-sm font-medium text-gray-300">LeetCode URL</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/two-sum/"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500/50"
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={loading || !url.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Fetch
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-yellow-400">{error}</p>}
        {imported && !error && (
          <p className="mt-2 flex items-center gap-1 text-xs text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Problem data imported. Review and customize below.
          </p>
        )}
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Basic Info */}
        <Section title="Basic Info">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Two Sum" />
            <Field label="LeetCode #" value={form.leetcodeNumber} onChange={v => setForm(p => ({ ...p, leetcodeNumber: v }))} placeholder="1" />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500/50"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Pattern</label>
              <select
                value={form.pattern}
                onChange={e => setForm(p => ({ ...p, pattern: e.target.value }))}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500/50"
              >
                {patterns.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Description */}
        <Section title="Description">
          <TextArea
            value={form.description}
            onChange={v => setForm(p => ({ ...p, description: v }))}
            placeholder="Given an array of integers nums and an integer target..."
            rows={6}
          />
        </Section>

        {/* Starter Code */}
        <Section title="Starter Code">
          <TextArea
            value={form.starterCode}
            onChange={v => setForm(p => ({ ...p, starterCode: v }))}
            placeholder="function solution() { ... }"
            rows={4}
            mono
          />
        </Section>

        {/* Steps */}
        <Section title="Step-by-Step Breakdown">
          <div className="space-y-4">
            {form.steps.map((step, idx) => (
              <div key={idx} className="rounded-lg border border-gray-800 bg-gray-800/30 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Step {idx + 1}</span>
                  {form.steps.length > 1 && (
                    <button onClick={() => removeStep(idx)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Field label="Title" value={step.title} onChange={v => updateStep(idx, 'title', v)} placeholder="Understand the Problem" />
                <div className="mt-2">
                  <Field label="Hint" value={step.hint} onChange={v => updateStep(idx, 'hint', v)} placeholder="Think about..." />
                </div>
                <div className="mt-2">
                  <TextArea label="Approach" value={step.approach} onChange={v => updateStep(idx, 'approach', v)} placeholder="Describe the approach..." rows={3} />
                </div>
                <div className="mt-2">
                  <TextArea label="Code" value={step.code} onChange={v => updateStep(idx, 'code', v)} placeholder="function solution() { ... }" rows={4} mono />
                </div>
                <div className="mt-2">
                  <Field label="Complexity" value={step.complexity} onChange={v => updateStep(idx, 'complexity', v)} placeholder="Time: O(n), Space: O(1)" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addStep} className="mt-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
            <Plus className="h-3.5 w-3.5" /> Add Step
          </button>
        </Section>

        {/* Test Cases */}
        <Section title="Test Cases">
          <p className="mb-3 text-xs text-gray-500">Enter args and expected as JSON arrays. e.g. args: [[2,7,11,15], 9] expected: [0,1]</p>
          <div className="space-y-3">
            {form.testCases.map((tc, idx) => (
              <div key={idx} className="rounded-lg border border-gray-800 bg-gray-800/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Test {idx + 1}</span>
                  {form.testCases.length > 1 && (
                    <button onClick={() => removeTestCase(idx)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Field label="Args (JSON)" value={tc.args} onChange={v => updateTestCase(idx, 'args', v)} placeholder='[[2,7,11,15], 9]' mono />
                <div className="mt-2">
                  <Field label="Expected (JSON)" value={tc.expected} onChange={v => updateTestCase(idx, 'expected', v)} placeholder='[0,1]' mono />
                </div>
                <div className="mt-2">
                  <Field label="Description" value={tc.description} onChange={v => updateTestCase(idx, 'description', v)} placeholder="Basic case" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addTestCase} className="mt-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
            <Plus className="h-3.5 w-3.5" /> Add Test Case
          </button>
        </Section>

        {/* Anki Cards */}
        <Section title="Anki Flashcards (Optional)">
          <div className="space-y-3">
            {form.ankiCards.map((card, idx) => (
              <div key={idx} className="rounded-lg border border-gray-800 bg-gray-800/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Card {idx + 1}</span>
                  {form.ankiCards.length > 1 && (
                    <button onClick={() => removeAnkiCard(idx)} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Field label="Front (Question)" value={card.front} onChange={v => updateAnkiCard(idx, 'front', v)} placeholder="What pattern does Two Sum use?" />
                <div className="mt-2">
                  <Field label="Back (Answer)" value={card.back} onChange={v => updateAnkiCard(idx, 'back', v)} placeholder="Hash Map lookup for complement" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addAnkiCard} className="mt-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
            <Plus className="h-3.5 w-3.5" /> Add Card
          </button>
        </Section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Import Problem
        </button>
        <div className="h-8" />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
      <h2 className="mb-3 text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono }) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs font-medium text-gray-400">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500/50 ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3, mono }) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs font-medium text-gray-400">{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500/50 ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  );
}
