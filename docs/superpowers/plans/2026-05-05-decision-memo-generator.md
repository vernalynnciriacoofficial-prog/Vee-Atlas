# Decision Memo Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side React web app that converts a free-text executive decision description into an editable, print-ready one-pager via two Claude API calls.

**Architecture:** Three-step flow — (1) free-text input, Claude extracts structured JSON; (2) user reviews and edits the structured form; (3) Claude generates the full memo, which renders as a `contenteditable` document. No backend; Claude API called directly from the browser using `@anthropic-ai/sdk` with `dangerouslyAllowBrowser: true`. API key stored in `localStorage`.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, `@anthropic-ai/sdk`, Vitest, `@testing-library/react`

**Spec:** `docs/superpowers/specs/2026-05-05-decision-memo-generator-design.md`

---

## File Map

```
apps/decision-memo/
  index.html
  vite.config.js          — Vite + Vitest config
  tailwind.config.js
  postcss.config.js
  package.json
  src/
    main.jsx              — React root mount
    index.css             — Tailwind directives
    setupTests.js         — @testing-library/jest-dom import
    App.jsx               — Step state machine + ApiKeyGate
    styles/
      print.css           — @media print: page margins, hide controls
    utils/
      validateJson.js     — JSON validation for both API responses
    hooks/
      useClaude.js        — Claude API wrapper hook
    prompts/
      extractStructure.js — Prompt builder for call #1
      generateMemo.js     — Prompt builder for call #2
    components/
      ApiKeyGate.jsx      — API key entry, stores to localStorage
      Step1_FreeText.jsx  — Free-text textarea + Analyse button
      Step2_StructuredForm.jsx — Editable structured form
      Step3_Memo.jsx      — Editable memo document
      MemoSection.jsx     — Reusable section block (heading + children)
      OptionCard.jsx      — Option: name, description, risk badge, bullets
      ExportButton.jsx    — window.print() trigger
    __tests__/
      validateJson.test.js
      prompts.test.js
      useClaude.test.js
```

---

## Task 1: Project Scaffold ✅ COMPLETE

**Files:**
- Create: `apps/decision-memo/` (full scaffold)

- [x] **Step 1: Scaffold the Vite + React project**

Run from inside `apps/`:
```bash
cd apps
npm create vite@latest decision-memo -- --template react
cd decision-memo
npm install
```

Expected: `apps/decision-memo/` created with `src/`, `package.json`, `vite.config.js`, `index.html`.

- [ ] **Step 2: Install Tailwind CSS**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Replace the generated `tailwind.config.js` with:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

Replace the contents of `src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Install Vitest and Testing Library**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Install the Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

- [ ] **Step 5: Configure Vitest in vite.config.js**

Replace `vite.config.js` with:
```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
});
```

Create `src/setupTests.js`:
```js
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Create the print stylesheet**

Create `src/styles/print.css`:
```css
@media print {
  @page {
    margin: 1in;
  }

  body {
    background: white !important;
  }
}
```

- [ ] **Step 7: Update main.jsx**

Replace `src/main.jsx` with:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/print.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 8: Run the test suite to confirm zero-test baseline**

```bash
npm test
```

Expected output: `No test files found` or `0 tests passed`. No errors.

- [ ] **Step 9: Confirm the dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on `http://localhost:5173`. Stop it with Ctrl+C.

- [ ] **Step 10: Commit**

```bash
git add apps/decision-memo
git commit -m "feat: scaffold decision-memo Vite + React + Tailwind + Vitest"
```

---

## Task 2: JSON Validation Utility (TDD) ✅ COMPLETE

**Files:**
- Create: `apps/decision-memo/src/utils/validateJson.js`
- Create: `apps/decision-memo/src/__tests__/validateJson.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/validateJson.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { validateExtractStructure, validateGenerateMemo } from '../utils/validateJson';

// ── validateExtractStructure ─────────────────────────────────────────────────

describe('validateExtractStructure', () => {
  const valid = {
    title: 'Should we hire a designer?',
    context: 'Budget is tight and launch is Q3.',
    constraints: ['$50k budget'],
    stakeholders: ['CEO'],
    options: [
      { name: 'Hire FT', description: 'Full-time hire' },
      { name: 'Contract', description: 'Contract designer' },
    ],
  };

  it('passes for a valid response', () => {
    expect(() => validateExtractStructure(valid)).not.toThrow();
  });

  it('throws when title is missing', () => {
    expect(() => validateExtractStructure({ ...valid, title: '' })).toThrow();
  });

  it('throws when title is under 10 characters', () => {
    expect(() => validateExtractStructure({ ...valid, title: 'Short' })).toThrow();
  });

  it('throws when context is under 10 characters', () => {
    expect(() => validateExtractStructure({ ...valid, context: 'Brief.' })).toThrow();
  });

  it('throws when options has fewer than 2 items', () => {
    expect(() => validateExtractStructure({ ...valid, options: [valid.options[0]] })).toThrow();
  });

  it('throws when an option has no name', () => {
    const bad = { ...valid, options: [{ name: '', description: 'desc' }, { name: 'B', description: 'desc' }] };
    expect(() => validateExtractStructure(bad)).toThrow();
  });
});

// ── validateGenerateMemo ─────────────────────────────────────────────────────

describe('validateGenerateMemo', () => {
  const validOption = {
    name: 'Hire Full-Time',
    description: 'Bring on a full-time designer at market rate.',
    pros: ['Full control', 'Faster ramp-up'],
    cons: ['Higher cost', 'Slower to hire'],
    risk: 'Medium',
  };

  const valid = {
    context: 'The company needs design capacity before the Q3 launch.',
    options: [validOption, { ...validOption, name: 'Contract Out' }],
    recommendation: 'We recommend contracting out given the budget constraints.',
    nextSteps: ['Post job on Toptal', 'Define scope'],
  };

  it('passes for a valid response', () => {
    expect(() => validateGenerateMemo(valid)).not.toThrow();
  });

  it('throws when context is under 10 characters', () => {
    expect(() => validateGenerateMemo({ ...valid, context: 'Short.' })).toThrow();
  });

  it('throws when recommendation is under 10 characters', () => {
    expect(() => validateGenerateMemo({ ...valid, recommendation: 'Hire.' })).toThrow();
  });

  it('throws when options has fewer than 2 items', () => {
    expect(() => validateGenerateMemo({ ...valid, options: [validOption] })).toThrow();
  });

  it('throws when an option description is under 10 characters', () => {
    const bad = { ...valid, options: [{ ...validOption, description: 'Short.' }, validOption] };
    expect(() => validateGenerateMemo(bad)).toThrow();
  });

  it('throws when an option has fewer than 2 pros', () => {
    const bad = { ...valid, options: [{ ...validOption, pros: ['Only one'] }, validOption] };
    expect(() => validateGenerateMemo(bad)).toThrow();
  });

  it('throws when an option has fewer than 2 cons', () => {
    const bad = { ...valid, options: [{ ...validOption, cons: ['Only one'] }, validOption] };
    expect(() => validateGenerateMemo(bad)).toThrow();
  });

  it('silently defaults risk to Medium when the value is invalid', () => {
    const data = {
      ...valid,
      options: [{ ...validOption, risk: 'Unknown' }, validOption],
    };
    validateGenerateMemo(data);
    expect(data.options[0].risk).toBe('Medium');
  });
});
```

- [ ] **Step 2: Run to confirm all tests fail**

```bash
npm test validateJson
```

Expected: `Cannot find module '../utils/validateJson'` or similar.

- [ ] **Step 3: Implement validateJson.js**

Create `src/utils/validateJson.js`:
```js
const MIN_LENGTH = 10;
const VALID_RISKS = ['Low', 'Medium', 'High'];

export function validateExtractStructure(data) {
  for (const field of ['title', 'context']) {
    if (typeof data[field] !== 'string' || data[field].length < MIN_LENGTH) {
      throw new Error(`Field "${field}" is missing or too short`);
    }
  }
  if (!Array.isArray(data.options) || data.options.length < 2) {
    throw new Error('options must have at least 2 items');
  }
  for (const opt of data.options) {
    if (typeof opt.name !== 'string' || opt.name.trim() === '') {
      throw new Error('Each option must have a non-empty name');
    }
  }
}

export function validateGenerateMemo(data) {
  for (const field of ['context', 'recommendation']) {
    if (typeof data[field] !== 'string' || data[field].length < MIN_LENGTH) {
      throw new Error(`Field "${field}" is missing or too short`);
    }
  }
  if (!Array.isArray(data.options) || data.options.length < 2) {
    throw new Error('options must have at least 2 items');
  }
  for (const opt of data.options) {
    if (!VALID_RISKS.includes(opt.risk)) {
      opt.risk = 'Medium';
    }
    if (typeof opt.description !== 'string' || opt.description.length < MIN_LENGTH) {
      throw new Error(`Option "${opt.name}" description is missing or too short`);
    }
    if (!Array.isArray(opt.pros) || opt.pros.length < 2) {
      throw new Error(`Option "${opt.name}" must have at least 2 pros`);
    }
    if (!Array.isArray(opt.cons) || opt.cons.length < 2) {
      throw new Error(`Option "${opt.name}" must have at least 2 cons`);
    }
  }
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm test validateJson
```

Expected: `14 tests passed`.

- [ ] **Step 5: Commit**

```bash
git add src/utils/validateJson.js src/__tests__/validateJson.test.js
git commit -m "feat: add JSON validation utility for Claude responses"
```

---

## Task 3: Claude Prompts (TDD) ✅ COMPLETE

**Files:**
- Create: `apps/decision-memo/src/prompts/extractStructure.js`
- Create: `apps/decision-memo/src/prompts/generateMemo.js`
- Create: `apps/decision-memo/src/__tests__/prompts.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/prompts.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { buildExtractStructurePrompt } from '../prompts/extractStructure';
import { buildGenerateMemoPrompt } from '../prompts/generateMemo';

describe('buildExtractStructurePrompt', () => {
  it('includes the user text in the user prompt', () => {
    const { user } = buildExtractStructurePrompt('We must decide on vendor selection.');
    expect(user).toContain('We must decide on vendor selection.');
  });

  it('instructs Claude to begin the response with {', () => {
    const { user } = buildExtractStructurePrompt('test');
    expect(user).toContain('Begin your response with {');
  });

  it('system prompt instructs JSON-only output', () => {
    const { system } = buildExtractStructurePrompt('test');
    expect(system.toLowerCase()).toContain('json');
    expect(system).toContain('no markdown');
  });

  it('returns both system and user keys', () => {
    const result = buildExtractStructurePrompt('test');
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('user');
  });
});

describe('buildGenerateMemoPrompt', () => {
  const sampleData = {
    title: 'Designer Hiring Decision',
    context: 'We need design capacity before Q3.',
    constraints: ['$50k budget', 'Q3 deadline'],
    stakeholders: ['CEO', 'Head of Product'],
    options: [
      { name: 'Hire FT', description: 'Full-time hire' },
      { name: 'Contract', description: 'Contract designer' },
    ],
  };

  it('includes the decision title in the user prompt', () => {
    const { user } = buildGenerateMemoPrompt(sampleData);
    expect(user).toContain('Designer Hiring Decision');
  });

  it('includes all option names in the user prompt', () => {
    const { user } = buildGenerateMemoPrompt(sampleData);
    expect(user).toContain('Hire FT');
    expect(user).toContain('Contract');
  });

  it('instructs Claude to begin the response with {', () => {
    const { user } = buildGenerateMemoPrompt(sampleData);
    expect(user).toContain('Begin your response with {');
  });

  it('system prompt enforces the risk enum', () => {
    const { system } = buildGenerateMemoPrompt(sampleData);
    expect(system).toContain('"Low"');
    expect(system).toContain('"Medium"');
    expect(system).toContain('"High"');
  });

  it('returns both system and user keys', () => {
    const result = buildGenerateMemoPrompt(sampleData);
    expect(result).toHaveProperty('system');
    expect(result).toHaveProperty('user');
  });
});
```

- [ ] **Step 2: Run to confirm all tests fail**

```bash
npm test prompts
```

Expected: `Cannot find module '../prompts/extractStructure'`.

- [ ] **Step 3: Implement extractStructure.js**

Create `src/prompts/extractStructure.js`:
```js
export function buildExtractStructurePrompt(freeText) {
  const system = `You are an expert at structuring executive decision briefs.
Extract the key components from the user's decision description and return them as JSON.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
If the input does not specify concrete options, create placeholder options named "Option A", "Option B", etc.
Return between 2 and 4 options.`;

  const user = `Extract a structured decision brief from the following description:

${freeText}

Return a JSON object with this exact shape:
{
  "title": "short decision title",
  "context": "one to two sentence background summary",
  "constraints": ["constraint 1", "constraint 2"],
  "stakeholders": ["stakeholder 1"],
  "options": [
    { "name": "option name", "description": "brief description" }
  ]
}

Begin your response with {`;

  return { system, user };
}
```

- [ ] **Step 4: Implement generateMemo.js**

Create `src/prompts/generateMemo.js`:
```js
export function buildGenerateMemoPrompt(structuredData) {
  const system = `You are an expert at writing clear, concise executive decision memos.
Write a structured memo based on the provided decision data.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
The "risk" field must be exactly "Low", "Medium", or "High" — no other values.
Include between 2 and 4 pros and 2 and 4 cons per option.
Write the recommendation as one concise paragraph.`;

  const optionsList = structuredData.options
    .map((o, i) => `${i + 1}. ${o.name}: ${o.description}`)
    .join('\n');

  const user = `Generate a decision memo for the following:

Title: ${structuredData.title}
Context: ${structuredData.context}
Constraints: ${structuredData.constraints.join(', ')}
Stakeholders: ${structuredData.stakeholders.join(', ')}
Options to evaluate:
${optionsList}

Return a JSON object with this exact shape:
{
  "context": "expanded background paragraph",
  "options": [
    {
      "name": "option name",
      "description": "expanded description",
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1", "con 2"],
      "risk": "Low | Medium | High"
    }
  ],
  "recommendation": "one paragraph recommendation",
  "nextSteps": ["step 1", "step 2"]
}

Begin your response with {`;

  return { system, user };
}
```

- [ ] **Step 5: Run tests to confirm all pass**

```bash
npm test prompts
```

Expected: `10 tests passed`.

- [ ] **Step 6: Commit**

```bash
git add src/prompts/ src/__tests__/prompts.test.js
git commit -m "feat: add Claude prompt builders for extract and generate calls"
```

---

## Task 4: useClaude Hook (TDD) ✅ COMPLETE

**Files:**
- Create: `apps/decision-memo/src/hooks/useClaude.js`
- Create: `apps/decision-memo/src/__tests__/useClaude.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/useClaude.test.js`:
```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClaude } from '../hooks/useClaude';

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

describe('useClaude', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it('returns text from the API on success', async () => {
    mockCreate.mockResolvedValue({ content: [{ text: '{"ok": true}' }] });

    const { result } = renderHook(() => useClaude('test-key'));
    let text;
    await act(async () => {
      text = await result.current.call('system prompt', 'user prompt');
    });

    expect(text).toBe('{"ok": true}');
  });

  it('loading is true during the call and false after', async () => {
    let resolveCreate;
    mockCreate.mockReturnValue(new Promise(r => { resolveCreate = r; }));

    const { result } = renderHook(() => useClaude('test-key'));

    act(() => {
      result.current.call('system', 'user').catch(() => {});
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveCreate({ content: [{ text: '{}' }] });
    });

    expect(result.current.loading).toBe(false);
  });

  it('sets error and throws when the API fails', async () => {
    mockCreate.mockRejectedValue(new Error('invalid_api_key'));

    const { result } = renderHook(() => useClaude('bad-key'));
    await act(async () => {
      await expect(result.current.call('system', 'user')).rejects.toThrow('invalid_api_key');
    });

    expect(result.current.error).toBe('invalid_api_key');
  });

  it('clears the previous error on a new call', async () => {
    mockCreate
      .mockRejectedValueOnce(new Error('first error'))
      .mockResolvedValueOnce({ content: [{ text: '{}' }] });

    const { result } = renderHook(() => useClaude('test-key'));

    await act(async () => {
      await expect(result.current.call('s', 'u')).rejects.toThrow();
    });
    expect(result.current.error).toBe('first error');

    await act(async () => {
      await result.current.call('s', 'u');
    });
    expect(result.current.error).toBeNull();
  });
});
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm test useClaude
```

Expected: `Cannot find module '../hooks/useClaude'`.

- [ ] **Step 3: Implement useClaude.js**

Create `src/hooks/useClaude.js`:
```js
import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';

export function useClaude(apiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function call(systemPrompt, userPrompt) {
    setLoading(true);
    setError(null);
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      return message.content[0].text;
    } catch (err) {
      const msg = err.message || 'Claude API request failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, call };
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm test useClaude
```

Expected: `4 tests passed`.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useClaude.js src/__tests__/useClaude.test.js
git commit -m "feat: add useClaude hook wrapping Anthropic SDK"
```

---

## Task 5: ApiKeyGate Component

**Files:**
- Create: `apps/decision-memo/src/components/ApiKeyGate.jsx`

- [ ] **Step 1: Create ApiKeyGate.jsx**

Create `src/components/ApiKeyGate.jsx`:
```jsx
import { useState } from 'react';

export default function ApiKeyGate({ onSubmit }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1 text-gray-900">Decision Memo Generator</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter your Anthropic API key to get started. It is stored only in your browser and never sent anywhere except Anthropic.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sk-ant-..."
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-40 text-sm font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the component renders in the browser**

In `src/App.jsx`, temporarily render only `<ApiKeyGate onSubmit={console.log} />`, then run `npm run dev` and confirm the gate form appears at `http://localhost:5173`. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/components/ApiKeyGate.jsx
git commit -m "feat: add ApiKeyGate component"
```

---

## Task 6: App.jsx Step State Machine

**Files:**
- Modify: `apps/decision-memo/src/App.jsx`

- [ ] **Step 1: Replace App.jsx with the step state machine**

Replace `src/App.jsx` with:
```jsx
import { useState } from 'react';
import ApiKeyGate from './components/ApiKeyGate';

// Step components imported in later tasks — stubs used for now
function StepPlaceholder({ label }) {
  return <div className="p-12 text-center text-gray-400 text-sm">{label}</div>;
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('dmg_api_key') || '');
  const [step, setStep] = useState(1);
  const [structuredData, setStructuredData] = useState(null);
  const [memoData, setMemoData] = useState(null);

  function handleApiKey(key) {
    localStorage.setItem('dmg_api_key', key);
    setApiKey(key);
  }

  if (!apiKey) return <ApiKeyGate onSubmit={handleApiKey} />;

  return (
    <div className="min-h-screen bg-gray-100">
      {step === 1 && (
        <StepPlaceholder label="Step 1 — Free Text Input (coming soon)" />
      )}
      {step === 2 && (
        <StepPlaceholder label="Step 2 — Structured Form (coming soon)" />
      )}
      {step === 3 && (
        <StepPlaceholder label="Step 3 — Memo Output (coming soon)" />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run dev server and confirm ApiKeyGate → placeholder flow**

```bash
npm run dev
```

Open `http://localhost:5173`. Enter any key → should show "Step 1 — Free Text Input (coming soon)". Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add App step state machine with ApiKeyGate"
```

---

## Task 7: Step1_FreeText Component

**Files:**
- Create: `apps/decision-memo/src/components/Step1_FreeText.jsx`

- [ ] **Step 1: Create Step1_FreeText.jsx**

Create `src/components/Step1_FreeText.jsx`:
```jsx
import { useState } from 'react';
import { useClaude } from '../hooks/useClaude';
import { buildExtractStructurePrompt } from '../prompts/extractStructure';
import { validateExtractStructure } from '../utils/validateJson';

export default function Step1_FreeText({ apiKey, onComplete }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const { loading, call } = useClaude(apiKey);

  async function handleAnalyse() {
    setError(null);
    const { system, user } = buildExtractStructurePrompt(text);
    try {
      const raw = await call(system, user);
      const data = JSON.parse(raw);
      validateExtractStructure(data);
      onComplete(data);
    } catch {
      setError('Could not parse the response. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Describe the decision</h2>
        <p className="text-gray-500 text-sm mb-4">
          Write freely — what needs to be decided, the context, any constraints or options you are considering.
        </p>
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="e.g. We need to decide whether to hire a full-time designer or contract out. Budget is tight. Launch is Q3."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
        <button
          onClick={handleAnalyse}
          disabled={loading || text.trim().length < 20}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-40 text-sm font-medium"
        >
          {loading ? 'Analysing…' : 'Analyse →'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire Step1 into App.jsx**

In `src/App.jsx`, replace the Step 1 `StepPlaceholder` block with:
```jsx
import Step1_FreeText from './components/Step1_FreeText';

// inside the return:
{step === 1 && (
  <Step1_FreeText
    apiKey={apiKey}
    onComplete={data => { setStructuredData(data); setStep(2); }}
  />
)}
```

Add the import at the top of App.jsx alongside the other imports.

- [ ] **Step 3: Run dev server and manually test Step 1**

```bash
npm run dev
```

Enter an API key. On Step 1, type a decision description and click Analyse. Confirm:
- Button is disabled until 20+ characters are typed
- Loading state shows "Analysing…"
- After success, app moves to Step 2 placeholder

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Step1_FreeText.jsx src/App.jsx
git commit -m "feat: add Step1_FreeText with Claude extract call"
```

---

## Task 8: Step2_StructuredForm Component

**Files:**
- Create: `apps/decision-memo/src/components/Step2_StructuredForm.jsx`

- [ ] **Step 1: Create Step2_StructuredForm.jsx**

Create `src/components/Step2_StructuredForm.jsx`:
```jsx
import { useState } from 'react';
import { useClaude } from '../hooks/useClaude';
import { buildGenerateMemoPrompt } from '../prompts/generateMemo';
import { validateGenerateMemo } from '../utils/validateJson';

function Field({ label, value, onChange, multiline, className = '' }) {
  const base = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea className={`${base} resize-y min-h-20`} value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <input className={base} value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function Step2_StructuredForm({ initialData, apiKey, onComplete, onBack }) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const { loading, call } = useClaude(apiKey);

  function set(field, value) {
    setData(d => ({ ...d, [field]: value }));
  }

  function setOption(index, field, value) {
    setData(d => {
      const options = [...d.options];
      options[index] = { ...options[index], [field]: value };
      return { ...d, options };
    });
  }

  function addOption() {
    setData(d => ({ ...d, options: [...d.options, { name: '', description: '' }] }));
  }

  function removeOption(index) {
    setData(d => ({ ...d, options: d.options.filter((_, i) => i !== index) }));
  }

  async function handleGenerate() {
    setError(null);
    const { system, user } = buildGenerateMemoPrompt(data);
    try {
      const raw = await call(system, user);
      const memo = JSON.parse(raw);
      validateGenerateMemo(memo);
      onComplete({ ...memo, title: data.title });
    } catch {
      setError('Could not generate the memo. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Review the structure</h2>
        <p className="text-gray-500 text-sm mb-6">
          Check what was extracted and correct anything before generating the memo.
        </p>

        <Field label="Decision Title" value={data.title} onChange={v => set('title', v)} />
        <Field label="Context" value={data.context} onChange={v => set('context', v)} multiline />
        <Field
          label="Constraints (one per line)"
          value={data.constraints.join('\n')}
          onChange={v => set('constraints', v.split('\n'))}
          multiline
        />
        <Field
          label="Stakeholders (one per line)"
          value={data.stakeholders.join('\n')}
          onChange={v => set('stakeholders', v.split('\n'))}
          multiline
        />

        <p className="text-sm font-medium text-gray-700 mb-2">Options</p>
        {data.options.map((opt, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Option name"
                value={opt.name}
                onChange={e => setOption(i, 'name', e.target.value)}
              />
              {data.options.length > 2 && (
                <button
                  onClick={() => removeOption(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-2"
                >
                  Remove
                </button>
              )}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm resize-y min-h-16 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Brief description"
              value={opt.description}
              onChange={e => setOption(i, 'description', e.target.value)}
            />
          </div>
        ))}

        <button onClick={addOption} className="text-blue-600 hover:text-blue-800 text-sm mb-6 block">
          + Add option
        </button>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
          >
            ← Back
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-40 text-sm font-medium"
          >
            {loading ? 'Generating…' : 'Generate Memo →'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire Step2 into App.jsx**

In `src/App.jsx`, replace the Step 2 placeholder:
```jsx
import Step2_StructuredForm from './components/Step2_StructuredForm';

// inside the return:
{step === 2 && (
  <Step2_StructuredForm
    initialData={structuredData}
    apiKey={apiKey}
    onComplete={data => { setMemoData(data); setStep(3); }}
    onBack={() => setStep(1)}
  />
)}
```

- [ ] **Step 3: Run dev server and manually test Steps 1 and 2**

```bash
npm run dev
```

Complete Step 1 with a real decision. Confirm Step 2 pre-fills all fields. Edit a field. Remove an option. Add an option. Click Generate Memo. Confirm it moves to Step 3 placeholder. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Step2_StructuredForm.jsx src/App.jsx
git commit -m "feat: add Step2_StructuredForm with Claude generate call"
```

---

## Task 9: MemoSection and OptionCard Components

**Files:**
- Create: `apps/decision-memo/src/components/MemoSection.jsx`
- Create: `apps/decision-memo/src/components/OptionCard.jsx`

- [ ] **Step 1: Create MemoSection.jsx**

Create `src/components/MemoSection.jsx`:
```jsx
export default function MemoSection({ heading, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 print:text-gray-600">
        {heading}
      </h3>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create the EditableText helper used inside OptionCard**

This helper mounts initial text via a ref so React re-renders do not reset `contenteditable` content.

The helper lives inside `OptionCard.jsx` (not a separate file — it's only used there).

- [ ] **Step 3: Create OptionCard.jsx**

Create `src/components/OptionCard.jsx`:
```jsx
import { useState, useRef, useEffect } from 'react';

const RISK_CYCLE = ['Low', 'Medium', 'High'];

const RISK_STYLES = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

// Mounts initialValue once via ref so React re-renders don't reset the DOM.
function EditableText({ initialValue, onBlur: onBlurProp, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = initialValue;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onBlurProp?.(e.currentTarget.textContent.trim())}
      className={`outline-none ${className}`}
    />
  );
}

function BulletList({ items, setItems }) {
  function update(index, value) {
    setItems(prev => prev.map((item, i) => (i === index ? value : item)));
  }

  function remove(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function add() {
    setItems(prev => [...prev, 'New item']);
  }

  return (
    <div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1 group">
            <EditableText
              initialValue={item}
              onBlur={v => update(i, v)}
              className="flex-1 text-sm text-gray-700 leading-relaxed"
            />
            <button
              onClick={() => remove(i)}
              className="text-gray-300 hover:text-red-500 text-sm leading-5 print:hidden opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              aria-label="Delete bullet"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={add}
        className="text-blue-500 hover:text-blue-700 text-xs mt-2 print:hidden"
      >
        + Add
      </button>
    </div>
  );
}

export default function OptionCard({ option }) {
  const [risk, setRisk] = useState(option.risk);
  const [pros, setPros] = useState(option.pros);
  const [cons, setCons] = useState(option.cons);

  function cycleRisk() {
    setRisk(r => RISK_CYCLE[(RISK_CYCLE.indexOf(r) + 1) % RISK_CYCLE.length]);
  }

  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-4">
      <div className="flex items-center justify-between mb-2">
        <EditableText
          initialValue={option.name}
          className="font-semibold text-base text-gray-900"
        />
        <button
          onClick={cycleRisk}
          className={`text-xs font-medium px-2.5 py-1 rounded print:cursor-default ${RISK_STYLES[risk]}`}
        >
          Risk: {risk}
        </button>
      </div>
      <EditableText
        initialValue={option.description}
        className="text-sm text-gray-600 mb-4 block leading-relaxed"
      />
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="font-semibold text-gray-700 mb-2">Pros</p>
          <BulletList items={pros} setItems={setPros} />
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-2">Cons</p>
          <BulletList items={cons} setItems={setCons} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MemoSection.jsx src/components/OptionCard.jsx
git commit -m "feat: add MemoSection and OptionCard components"
```

---

## Task 10: Step3_Memo Component

**Files:**
- Create: `apps/decision-memo/src/components/Step3_Memo.jsx`
- Create: `apps/decision-memo/src/components/ExportButton.jsx`

- [ ] **Step 1: Create ExportButton.jsx**

Create `src/components/ExportButton.jsx`:
```jsx
export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-900 text-sm font-medium"
    >
      Export PDF
    </button>
  );
}
```

- [ ] **Step 2: Create the PlaceholderField helper**

This helper lives inside `Step3_Memo.jsx`. It simulates `placeholder` attribute behavior on a `contenteditable` span: the placeholder text clears on first focus and restores on blur if left empty.

- [ ] **Step 3: Create Step3_Memo.jsx**

Create `src/components/Step3_Memo.jsx`:
```jsx
import { useRef, useState } from 'react';
import MemoSection from './MemoSection';
import OptionCard from './OptionCard';
import ExportButton from './ExportButton';

const PLACEHOLDER_EXEC = '[ Executive Name ]';
const PLACEHOLDER_AUTHOR = '[ Your Name ]';

function PlaceholderField({ placeholder, className = '' }) {
  const ref = useRef(null);
  const [isPlaceholder, setIsPlaceholder] = useState(true);

  function handleFocus() {
    if (isPlaceholder && ref.current) {
      ref.current.textContent = '';
      setIsPlaceholder(false);
    }
  }

  function handleBlur() {
    if (ref.current && ref.current.textContent.trim() === '') {
      ref.current.textContent = placeholder;
      setIsPlaceholder(true);
    }
  }

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`outline-none ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-800'} ${className}`}
    >
      {placeholder}
    </span>
  );
}

export default function Step3_Memo({ memoData, onBack }) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Toolbar */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-4 print:hidden">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>
        <ExportButton />
      </div>

      {/* Document */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-12 print:shadow-none print:rounded-none print:p-0 print:max-w-none">

        {/* Header */}
        <div className="border-b border-gray-200 pb-5 mb-7">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-sans mb-2">Decision Memo</p>
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-2xl font-bold text-gray-900 outline-none mb-5"
          >
            {memoData.title}
          </h1>
          <div className="text-sm text-gray-600 space-y-1.5 font-sans">
            <div>
              <span className="text-gray-400 mr-1">Date:</span>
              <span
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-gray-700"
              >
                {today}
              </span>
            </div>
            <div>
              <span className="text-gray-400 mr-1">Prepared for:</span>
              <PlaceholderField placeholder={PLACEHOLDER_EXEC} />
            </div>
            <div>
              <span className="text-gray-400 mr-1">Prepared by:</span>
              <PlaceholderField placeholder={PLACEHOLDER_AUTHOR} />
            </div>
          </div>
        </div>

        {/* Background */}
        <MemoSection heading="Background">
          <p
            contentEditable
            suppressContentEditableWarning
            className="text-sm text-gray-700 leading-relaxed outline-none"
          >
            {memoData.context}
          </p>
        </MemoSection>

        {/* Options */}
        <MemoSection heading="Options">
          {memoData.options.map((opt, i) => (
            <OptionCard key={i} option={opt} />
          ))}
        </MemoSection>

        {/* Recommendation */}
        <MemoSection heading="Recommendation">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <p className="text-xs text-blue-400 font-sans mb-2 print:hidden">
              ⚠ AI Draft — edit before sharing
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              className="text-sm text-gray-800 leading-relaxed outline-none"
            >
              {memoData.recommendation}
            </p>
          </div>
        </MemoSection>

        {/* Next Steps */}
        <MemoSection heading="Next Steps">
          <ul className="space-y-2">
            {memoData.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-300 mt-0.5 select-none">·</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none flex-1 leading-relaxed"
                >
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </MemoSection>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire Step3 into App.jsx**

In `src/App.jsx`, replace the Step 3 placeholder:
```jsx
import Step3_Memo from './components/Step3_Memo';

// inside the return:
{step === 3 && (
  <Step3_Memo
    memoData={memoData}
    onBack={() => setStep(2)}
  />
)}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Step3_Memo.jsx src/components/ExportButton.jsx src/App.jsx
git commit -m "feat: add Step3_Memo editable document and ExportButton"
```

---

## Task 11: Final App.jsx Wiring and Cleanup

**Files:**
- Modify: `apps/decision-memo/src/App.jsx`

- [ ] **Step 1: Write the final App.jsx**

Replace `src/App.jsx` with the complete wired version:
```jsx
import { useState } from 'react';
import ApiKeyGate from './components/ApiKeyGate';
import Step1_FreeText from './components/Step1_FreeText';
import Step2_StructuredForm from './components/Step2_StructuredForm';
import Step3_Memo from './components/Step3_Memo';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('dmg_api_key') || '');
  const [step, setStep] = useState(1);
  const [structuredData, setStructuredData] = useState(null);
  const [memoData, setMemoData] = useState(null);

  function handleApiKey(key) {
    localStorage.setItem('dmg_api_key', key);
    setApiKey(key);
  }

  if (!apiKey) return <ApiKeyGate onSubmit={handleApiKey} />;

  return (
    <div className="min-h-screen bg-gray-100">
      {step === 1 && (
        <Step1_FreeText
          apiKey={apiKey}
          onComplete={data => { setStructuredData(data); setStep(2); }}
        />
      )}
      {step === 2 && (
        <Step2_StructuredForm
          initialData={structuredData}
          apiKey={apiKey}
          onComplete={data => { setMemoData(data); setStep(3); }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3_Memo
          memoData={memoData}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run the full test suite**

```bash
npm test
```

Expected: all 18 tests pass (`validateJson`, `prompts`, `useClaude`). No failures.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire all steps in App.jsx"
```

---

## Task 12: Manual Smoke Test

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:5173`.

- [ ] **Step 2: API key gate**

Enter a valid Anthropic API key. Confirm the app moves to Step 1.

- [ ] **Step 3: Step 1 — Free text**

Type a decision description (at least 20 characters). Confirm the Analyse button is disabled below that threshold, enables above it. Click Analyse. Confirm loading state shows. Confirm Step 2 loads with pre-filled fields.

- [ ] **Step 4: Step 2 — Structured form**

Verify all fields are pre-filled. Edit the title. Remove one option (confirm it only works when 3+ options exist). Add an option. Click Generate Memo. Confirm loading state. Confirm Step 3 loads.

- [ ] **Step 5: Step 3 — Editable memo document**

Confirm:
- Title, Background, Options, Recommendation, Next Steps all render
- Clicking any text field makes it directly editable
- "Prepared for" and "Prepared by" show `[ Executive Name ]` / `[ Your Name ]` in italic muted style
- Clicking a placeholder clears it immediately; leaving it empty restores it
- Risk badge cycles Low → Medium → High → Low on click
- Clicking `+` adds a bullet; clicking `×` deletes one
- "AI Draft" label is visible

- [ ] **Step 6: PDF export**

Click Export PDF. Confirm:
- Print dialog opens
- In print preview, toolbar buttons, `×`/`+` bullet controls, and "AI Draft" label are hidden
- Page margins are approximately 1 inch
- Risk badges retain their background colors

- [ ] **Step 7: Error path**

Temporarily enter an invalid API key (clear localStorage, refresh, enter `sk-bad`). Attempt Step 1. Confirm an error message appears and no crash occurs.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: decision memo generator — complete"
```

---

## Self-Review Checklist

Run through the spec (`docs/superpowers/specs/2026-05-05-decision-memo-generator-design.md`) against this plan:

| Spec requirement | Covered by |
|---|---|
| React + Vite + Tailwind | Task 1 |
| API key stored in localStorage | Task 5, 6 |
| Step 1: free-text input | Task 7 |
| Step 2: AI pre-filled structured form | Task 8 |
| Step 3: contenteditable document | Task 10 |
| Two Claude API calls with JSON nudge (`Begin with {`) | Task 3 |
| Validate string fields ≥ 10 chars | Task 2 |
| Risk badge: Low / Medium / High enum, cycles on click | Task 9 |
| Pros/cons: add bullet, delete bullet | Task 9 |
| Placeholder fields clear on focus, restore on blur | Task 10 |
| Recommendation labeled "AI Draft — edit before sharing" | Task 10 |
| Export PDF via window.print() | Task 10 |
| Print styles: hide controls, 1in margins | Task 1 (print.css) |
| Error path: parse failure → "Try again" without losing form data | Tasks 7, 8 |
| Risk defaults to Medium on invalid value | Task 2 |
