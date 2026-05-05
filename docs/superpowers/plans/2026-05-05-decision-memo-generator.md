# Decision Memo Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side React web app where users describe a decision their exec needs to make, get a structured editable one-pager memo with options, pros/cons, risk levels, and a recommendation — exportable as PDF.

**Architecture:** Three-step flow managed in App.jsx. Step 1: free text input → Claude API call extracts structure. Step 2: user reviews/edits AI-prefilled structured form. Step 3: Claude generates full memo, rendered as a `contenteditable` document with print/PDF export. API key stored in localStorage.

**Tech Stack:** React 18, Vite 5, Tailwind CSS v3, Vitest, @testing-library/react, @testing-library/jest-dom, jsdom

---

## File Map

**Create:**
- `decision-memo/index.html`
- `decision-memo/package.json`
- `decision-memo/vite.config.js`
- `decision-memo/tailwind.config.js`
- `decision-memo/postcss.config.js`
- `decision-memo/src/main.jsx`
- `decision-memo/src/index.css`
- `decision-memo/src/test-setup.js`
- `decision-memo/src/App.jsx`
- `decision-memo/src/styles/print.css`
- `decision-memo/src/utils/validateStructure.js` + `.test.js`
- `decision-memo/src/utils/validateMemo.js` + `.test.js`
- `decision-memo/src/prompts/extractStructure.js`
- `decision-memo/src/prompts/generateMemo.js`
- `decision-memo/src/hooks/useClaude.js` + `.test.js`
- `decision-memo/src/components/ApiKeyGate.jsx` + `.test.jsx`
- `decision-memo/src/components/Step1_FreeText.jsx` + `.test.jsx`
- `decision-memo/src/components/Step2_StructuredForm.jsx` + `.test.jsx`
- `decision-memo/src/components/RiskBadge.jsx` + `.test.jsx`
- `decision-memo/src/components/OptionCard.jsx` + `.test.jsx`
- `decision-memo/src/components/Step3_Memo.jsx` + `.test.jsx`

---

### Task 1: Project Scaffold

**Files:**
- Create: `decision-memo/package.json`
- Create: `decision-memo/vite.config.js`
- Create: `decision-memo/tailwind.config.js`
- Create: `decision-memo/postcss.config.js`
- Create: `decision-memo/index.html`
- Create: `decision-memo/src/main.jsx`
- Create: `decision-memo/src/index.css`
- Create: `decision-memo/src/test-setup.js`
- Create: `decision-memo/src/App.jsx` (shell only)
- Create: `decision-memo/src/styles/print.css` (empty)

- [ ] **Step 1: Create decision-memo/package.json**

```json
{
  "name": "decision-memo",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.7",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run from `decision-memo/`:
```bash
npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Create decision-memo/vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 4: Create decision-memo/tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 5: Create decision-memo/postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create decision-memo/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Decision Memo Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create decision-memo/src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/print.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 8: Create decision-memo/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Create decision-memo/src/test-setup.js**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 10: Create shell decision-memo/src/App.jsx**

```jsx
import React from 'react'

export default function App() {
  return <div className="p-8 font-sans">Decision Memo Generator — scaffold</div>
}
```

- [ ] **Step 11: Create empty decision-memo/src/styles/print.css**

```css
/* Print rules added in Task 11 */
```

- [ ] **Step 12: Verify dev server starts**

Run from `decision-memo/`:
```bash
npm run dev
```
Expected: Vite prints a local URL (e.g. `http://localhost:5173`). Opening it shows "Decision Memo Generator — scaffold".

- [ ] **Step 13: Commit**

```bash
git add decision-memo/
git commit -m "feat: scaffold decision-memo React/Vite/Tailwind app"
```

---

### Task 2: Validation Utilities

**Files:**
- Create: `decision-memo/src/utils/validateStructure.js`
- Create: `decision-memo/src/utils/validateStructure.test.js`
- Create: `decision-memo/src/utils/validateMemo.js`
- Create: `decision-memo/src/utils/validateMemo.test.js`

These validate the two Claude JSON responses. A response fails if any required string field is missing or under 10 characters. Arrays must be non-empty. `validateMemo` normalises invalid `risk` values to `"Medium"` silently rather than failing.

- [ ] **Step 1: Write failing tests for validateStructure**

```js
// decision-memo/src/utils/validateStructure.test.js
import { describe, it, expect } from 'vitest'
import { validateStructure } from './validateStructure.js'

const valid = {
  title: 'Hire Designer vs. Contract',
  context: 'We need design resources for Q3 launch.',
  constraints: ['Budget under $50k'],
  stakeholders: ['CEO', 'Head of Product'],
  options: [
    { name: 'Full-time hire', description: 'Hire a senior designer on payroll.' },
    { name: 'Contract agency', description: 'Engage a design agency for the project.' },
  ],
}

describe('validateStructure', () => {
  it('returns true for a valid response', () => {
    expect(validateStructure(valid)).toBe(true)
  })

  it('returns false when title is empty string', () => {
    expect(validateStructure({ ...valid, title: '' })).toBe(false)
  })

  it('returns false when title is under 10 chars', () => {
    expect(validateStructure({ ...valid, title: 'Short' })).toBe(false)
  })

  it('returns false when context is under 10 chars', () => {
    expect(validateStructure({ ...valid, context: 'Too short' })).toBe(false)
  })

  it('returns false when options is empty array', () => {
    expect(validateStructure({ ...valid, options: [] })).toBe(false)
  })

  it('returns false when an option name is under 10 chars', () => {
    const bad = { ...valid, options: [{ name: 'Hi', description: 'A long enough description here.' }] }
    expect(validateStructure(bad)).toBe(false)
  })

  it('returns false when an option description is under 10 chars', () => {
    const bad = { ...valid, options: [{ name: 'Full-time hire', description: 'Short.' }] }
    expect(validateStructure(bad)).toBe(false)
  })

  it('returns false for null input', () => {
    expect(validateStructure(null)).toBe(false)
  })

  it('returns false when options is not an array', () => {
    expect(validateStructure({ ...valid, options: 'not an array' })).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run from `decision-memo/`:
```bash
npm test -- --reporter=verbose src/utils/validateStructure.test.js
```
Expected: All 9 tests FAIL with "Cannot find module" or similar.

- [ ] **Step 3: Implement validateStructure**

```js
// decision-memo/src/utils/validateStructure.js
const MIN_LEN = 10

function isValidString(s) {
  return typeof s === 'string' && s.trim().length >= MIN_LEN
}

export function validateStructure(json) {
  if (!json || typeof json !== 'object') return false
  if (!isValidString(json.title)) return false
  if (!isValidString(json.context)) return false
  if (!Array.isArray(json.options) || json.options.length === 0) return false
  for (const opt of json.options) {
    if (!isValidString(opt.name)) return false
    if (!isValidString(opt.description)) return false
  }
  return true
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/utils/validateStructure.test.js
```
Expected: All 9 tests PASS.

- [ ] **Step 5: Write failing tests for validateMemo**

```js
// decision-memo/src/utils/validateMemo.test.js
import { describe, it, expect } from 'vitest'
import { validateMemo } from './validateMemo.js'

const valid = {
  context: 'The company needs design resources ahead of the Q3 product launch.',
  options: [
    {
      name: 'Full-time hire',
      description: 'Bring a senior designer onto payroll for ongoing work.',
      pros: ['Long-term investment', 'Deep product knowledge'],
      cons: ['Higher upfront cost', 'Longer hiring timeline'],
      risk: 'Low',
    },
    {
      name: 'Contract agency',
      description: 'Engage a design agency for the duration of the project.',
      pros: ['Faster to start', 'Lower commitment'],
      cons: ['Higher hourly rate', 'Less context over time'],
      risk: 'Medium',
    },
  ],
  recommendation: 'We recommend the full-time hire given the long-term design needs.',
  nextSteps: ['Post the job description by May 15', 'Interview candidates in June'],
}

describe('validateMemo', () => {
  it('returns true for a valid response', () => {
    expect(validateMemo(valid)).toBe(true)
  })

  it('returns false when context is under 10 chars', () => {
    expect(validateMemo({ ...valid, context: 'Short' })).toBe(false)
  })

  it('returns false when recommendation is under 10 chars', () => {
    expect(validateMemo({ ...valid, recommendation: 'TBD' })).toBe(false)
  })

  it('returns false when options is empty', () => {
    expect(validateMemo({ ...valid, options: [] })).toBe(false)
  })

  it('returns false when option name is under 10 chars', () => {
    const bad = { ...valid, options: [{ ...valid.options[0], name: 'Hi' }] }
    expect(validateMemo(bad)).toBe(false)
  })

  it('returns false when option has no pros', () => {
    const bad = { ...valid, options: [{ ...valid.options[0], pros: [] }] }
    expect(validateMemo(bad)).toBe(false)
  })

  it('returns false when option has no cons', () => {
    const bad = { ...valid, options: [{ ...valid.options[0], cons: [] }] }
    expect(validateMemo(bad)).toBe(false)
  })

  it('returns false when option description is under 10 chars', () => {
    const bad = { ...valid, options: [{ ...valid.options[0], description: 'Short' }] }
    expect(validateMemo(bad)).toBe(false)
  })

  it('normalises invalid risk to Medium and still returns true', () => {
    const data = {
      ...valid,
      options: [{ ...valid.options[0], risk: 'Extreme' }],
    }
    expect(validateMemo(data)).toBe(true)
    expect(data.options[0].risk).toBe('Medium')
  })

  it('returns false for null input', () => {
    expect(validateMemo(null)).toBe(false)
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/utils/validateMemo.test.js
```
Expected: All 10 tests FAIL.

- [ ] **Step 7: Implement validateMemo**

```js
// decision-memo/src/utils/validateMemo.js
const MIN_LEN = 10
const VALID_RISK = new Set(['Low', 'Medium', 'High'])

function isValidString(s) {
  return typeof s === 'string' && s.trim().length >= MIN_LEN
}

export function validateMemo(json) {
  if (!json || typeof json !== 'object') return false
  if (!isValidString(json.context)) return false
  if (!isValidString(json.recommendation)) return false
  if (!Array.isArray(json.options) || json.options.length === 0) return false
  for (const opt of json.options) {
    if (!isValidString(opt.name)) return false
    if (!isValidString(opt.description)) return false
    if (!Array.isArray(opt.pros) || opt.pros.length === 0) return false
    if (!Array.isArray(opt.cons) || opt.cons.length === 0) return false
    if (!VALID_RISK.has(opt.risk)) {
      opt.risk = 'Medium'
    }
  }
  return true
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/utils/validateMemo.test.js
```
Expected: All 10 tests PASS.

- [ ] **Step 9: Commit**

```bash
git add decision-memo/src/utils/
git commit -m "feat: add JSON validation utilities for Claude responses"
```

---

### Task 3: Claude Prompts

**Files:**
- Create: `decision-memo/src/prompts/extractStructure.js`
- Create: `decision-memo/src/prompts/generateMemo.js`

No tests (pure string constants). The prompts enforce JSON-only output, field constraints, the `{` prefix nudge, and the `Low | Medium | High` risk enum.

- [ ] **Step 1: Create extractStructure.js**

```js
// decision-memo/src/prompts/extractStructure.js
export const EXTRACT_STRUCTURE_SYSTEM = `You are an expert at analyzing decision briefs and extracting structured information. You always respond with valid JSON only — no prose, no markdown, no code fences.`

export function buildExtractStructurePrompt(freeText) {
  return `Analyze the following decision description and extract a structured summary.

Return a JSON object with exactly these fields:
{
  "title": "A clear, specific decision title (minimum 10 characters)",
  "context": "A paragraph summarizing the situation and why a decision is needed (minimum 10 characters)",
  "constraints": ["array of constraints or limiting factors — can be empty"],
  "stakeholders": ["array of people or roles involved — can be empty"],
  "options": [
    {
      "name": "Option name (minimum 10 characters)",
      "description": "What this option involves (minimum 10 characters)"
    }
  ]
}

Rules:
- Return 2 to 4 options minimum
- If the input is vague, infer reasonable options from context
- All string fields must be at least 10 characters
- options must have at least 2 entries
- No markdown, no prose, no explanation outside the JSON

Begin your response with { and return only valid JSON.

Decision description:
${freeText}`
}
```

- [ ] **Step 2: Create generateMemo.js**

```js
// decision-memo/src/prompts/generateMemo.js
export const GENERATE_MEMO_SYSTEM = `You are an expert executive communications writer. You write clear, concise decision memos for senior leaders. You always respond with valid JSON only — no prose, no markdown, no code fences.`

export function buildGenerateMemoPrompt(structuredData) {
  return `Write a complete decision memo based on the following structured data.

Input data:
${JSON.stringify(structuredData, null, 2)}

Return a JSON object with exactly these fields:
{
  "context": "A polished background paragraph explaining why this decision is needed (minimum 10 characters)",
  "options": [
    {
      "name": "Option name (minimum 10 characters, match input names exactly)",
      "description": "Polished 1-2 sentence description (minimum 10 characters)",
      "pros": ["2 to 4 pros, each a complete sentence"],
      "cons": ["2 to 4 cons, each a complete sentence"],
      "risk": "Low OR Medium OR High — exactly one of these three values, nothing else"
    }
  ],
  "recommendation": "One clear paragraph recommending an option with reasoning (minimum 10 characters)",
  "nextSteps": ["2 to 4 concrete action items"]
}

Rules:
- risk must be exactly "Low", "Medium", or "High" — nothing else
- Each pros/cons array must have at least 2 entries
- All string fields must be at least 10 characters
- Match the number and names of options from the input data exactly
- Write for a busy executive — clear, direct, no jargon
- No markdown, no prose, no explanation outside the JSON

Begin your response with { and return only valid JSON.`
}
```

- [ ] **Step 3: Commit**

```bash
git add decision-memo/src/prompts/
git commit -m "feat: add Claude prompt definitions for memo generation"
```

---

### Task 4: useClaude Hook

**Files:**
- Create: `decision-memo/src/hooks/useClaude.js`
- Create: `decision-memo/src/hooks/useClaude.test.js`

Wraps fetch calls to the Claude API. Exposes `{ loading, error, call }` where `call(systemPrompt, userPrompt)` returns parsed JSON or throws on network failure, non-2xx status, or malformed JSON.

- [ ] **Step 1: Write failing tests**

```js
// decision-memo/src/hooks/useClaude.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClaude } from './useClaude.js'

beforeEach(() => {
  localStorage.setItem('claudeApiKey', 'sk-ant-test-key-12345')
  vi.restoreAllMocks()
})

describe('useClaude', () => {
  it('starts with loading=false and error=null', () => {
    const { result } = renderHook(() => useClaude())
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('returns parsed JSON on success', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ content: [{ text: '{"result": "ok"}' }] }),
      })
    )
    const { result } = renderHook(() => useClaude())
    let data
    await act(async () => {
      data = await result.current.call('system', 'user')
    })
    expect(data).toEqual({ result: 'ok' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('sets loading=true while call is in flight', async () => {
    let resolveRequest
    global.fetch = vi.fn(
      () => new Promise(res => { resolveRequest = res })
    )
    const { result } = renderHook(() => useClaude())
    act(() => { result.current.call('system', 'user') })
    expect(result.current.loading).toBe(true)
    resolveRequest({
      ok: true,
      json: async () => ({ content: [{ text: '{}' }] }),
    })
  })

  it('sets error when fetch returns non-ok status', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 401, json: async () => ({}) })
    )
    const { result } = renderHook(() => useClaude())
    await act(async () => {
      await result.current.call('system', 'user').catch(() => {})
    })
    expect(result.current.error).toMatch(/401/)
    expect(result.current.loading).toBe(false)
  })

  it('sets error when Claude returns malformed JSON', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ content: [{ text: 'not json at all' }] }),
      })
    )
    const { result } = renderHook(() => useClaude())
    await act(async () => {
      await result.current.call('system', 'user').catch(() => {})
    })
    expect(result.current.error).toBeTruthy()
    expect(result.current.loading).toBe(false)
  })

  it('calls fetch with the correct Claude API URL and headers', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ content: [{ text: '{}' }] }),
      })
    )
    const { result } = renderHook(() => useClaude())
    await act(async () => { await result.current.call('sys', 'usr') })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-api-key': 'sk-ant-test-key-12345',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        }),
      })
    )
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/hooks/useClaude.test.js
```
Expected: All 6 tests FAIL.

- [ ] **Step 3: Implement useClaude**

```js
// decision-memo/src/hooks/useClaude.js
import { useState } from 'react'

export function useClaude() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function call(systemPrompt, userPrompt) {
    const apiKey = localStorage.getItem('claudeApiKey')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const parsed = JSON.parse(data.content[0].text)
      return parsed
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, call }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/hooks/useClaude.test.js
```
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/hooks/
git commit -m "feat: add useClaude hook with loading/error state"
```

---

### Task 5: ApiKeyGate Component

**Files:**
- Create: `decision-memo/src/components/ApiKeyGate.jsx`
- Create: `decision-memo/src/components/ApiKeyGate.test.jsx`

Renders children when a Claude API key exists in `localStorage`. Shows an entry form otherwise.

- [ ] **Step 1: Write failing tests**

```jsx
// decision-memo/src/components/ApiKeyGate.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ApiKeyGate from './ApiKeyGate.jsx'

beforeEach(() => {
  localStorage.clear()
})

describe('ApiKeyGate', () => {
  it('shows the key entry form when no key in localStorage', () => {
    render(<ApiKeyGate><div>App content</div></ApiKeyGate>)
    expect(screen.getByPlaceholderText(/sk-ant/i)).toBeInTheDocument()
    expect(screen.queryByText('App content')).not.toBeInTheDocument()
  })

  it('renders children when key exists in localStorage', () => {
    localStorage.setItem('claudeApiKey', 'sk-ant-test-12345678')
    render(<ApiKeyGate><div>App content</div></ApiKeyGate>)
    expect(screen.getByText('App content')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/sk-ant/i)).not.toBeInTheDocument()
  })

  it('saves key to localStorage and shows children on submit', () => {
    render(<ApiKeyGate><div>App content</div></ApiKeyGate>)
    fireEvent.change(screen.getByPlaceholderText(/sk-ant/i), {
      target: { value: 'sk-ant-my-real-key-abc' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(localStorage.getItem('claudeApiKey')).toBe('sk-ant-my-real-key-abc')
    expect(screen.getByText('App content')).toBeInTheDocument()
  })

  it('does not save an empty key', () => {
    render(<ApiKeyGate><div>App content</div></ApiKeyGate>)
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(localStorage.getItem('claudeApiKey')).toBeNull()
    expect(screen.queryByText('App content')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/components/ApiKeyGate.test.jsx
```
Expected: All 4 tests FAIL.

- [ ] **Step 3: Implement ApiKeyGate**

```jsx
// decision-memo/src/components/ApiKeyGate.jsx
import React, { useState } from 'react'

export default function ApiKeyGate({ children }) {
  const [saved, setSaved] = useState(!!localStorage.getItem('claudeApiKey'))
  const [input, setInput] = useState('')

  function handleSave() {
    if (!input.trim()) return
    localStorage.setItem('claudeApiKey', input.trim())
    setSaved(true)
  }

  if (saved) return children

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Decision Memo Generator</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your Claude API key to get started. It is stored only in your browser.
        </p>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm font-medium"
        >
          Save API Key
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/components/ApiKeyGate.test.jsx
```
Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/components/ApiKeyGate.jsx decision-memo/src/components/ApiKeyGate.test.jsx
git commit -m "feat: add ApiKeyGate with localStorage persistence"
```

---

### Task 6: Step1_FreeText Component

**Files:**
- Create: `decision-memo/src/components/Step1_FreeText.jsx`
- Create: `decision-memo/src/components/Step1_FreeText.test.jsx`

Free text input. Calls `onAnalyse(text)` on submit. Shows loading/error states.

- [ ] **Step 1: Write failing tests**

```jsx
// decision-memo/src/components/Step1_FreeText.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Step1_FreeText from './Step1_FreeText.jsx'

describe('Step1_FreeText', () => {
  it('renders the textarea and Analyse button', () => {
    render(<Step1_FreeText onAnalyse={vi.fn()} loading={false} error={null} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyse/i })).toBeInTheDocument()
  })

  it('calls onAnalyse with the textarea value on submit', () => {
    const onAnalyse = vi.fn()
    render(<Step1_FreeText onAnalyse={onAnalyse} loading={false} error={null} />)
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'We need to decide which vendor to use for cloud hosting.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /analyse/i }))
    expect(onAnalyse).toHaveBeenCalledWith(
      'We need to decide which vendor to use for cloud hosting.'
    )
  })

  it('does not call onAnalyse when textarea is empty', () => {
    const onAnalyse = vi.fn()
    render(<Step1_FreeText onAnalyse={onAnalyse} loading={false} error={null} />)
    fireEvent.click(screen.getByRole('button', { name: /analyse/i }))
    expect(onAnalyse).not.toHaveBeenCalled()
  })

  it('disables button and shows loading text when loading=true', () => {
    render(<Step1_FreeText onAnalyse={vi.fn()} loading={true} error={null} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveTextContent(/analysing/i)
  })

  it('shows error message when error is set', () => {
    render(<Step1_FreeText onAnalyse={vi.fn()} loading={false} error="API error 401" />)
    expect(screen.getByText(/api error 401/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/components/Step1_FreeText.test.jsx
```
Expected: All 5 tests FAIL.

- [ ] **Step 3: Implement Step1_FreeText**

```jsx
// decision-memo/src/components/Step1_FreeText.jsx
import React, { useState } from 'react'

export default function Step1_FreeText({ onAnalyse, loading, error }) {
  const [text, setText] = useState('')

  function handleSubmit() {
    if (!text.trim()) return
    onAnalyse(text.trim())
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Decision Memo Generator</h1>
      <p className="text-sm text-gray-500 mb-6">
        Describe a decision your exec needs to make. Be as specific or as rough as you like.
      </p>
      <textarea
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={8}
        placeholder="e.g. We need to decide whether to hire a full-time designer or contract out. Budget is tight and the Q3 launch is critical..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-6 py-2.5 text-sm font-medium"
      >
        {loading ? 'Analysing…' : 'Analyse'}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/components/Step1_FreeText.test.jsx
```
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/components/Step1_FreeText.jsx decision-memo/src/components/Step1_FreeText.test.jsx
git commit -m "feat: add Step1_FreeText component"
```

---

### Task 7: Step2_StructuredForm Component

**Files:**
- Create: `decision-memo/src/components/Step2_StructuredForm.jsx`
- Create: `decision-memo/src/components/Step2_StructuredForm.test.jsx`

Displays the AI-extracted structure as an editable form. Calls `onGenerate(formData)` with current form state on submit. Shows inline error with "Try again" button on failure.

- [ ] **Step 1: Write failing tests**

```jsx
// decision-memo/src/components/Step2_StructuredForm.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Step2_StructuredForm from './Step2_StructuredForm.jsx'

const sampleData = {
  title: 'Hire Designer vs. Contract Agency',
  context: 'We need design resources ahead of Q3 launch.',
  constraints: ['Budget under $50k'],
  stakeholders: ['CEO', 'Head of Product'],
  options: [
    { name: 'Full-time hire', description: 'Bring a senior designer onto payroll.' },
    { name: 'Contract agency', description: 'Engage a design agency for the project.' },
  ],
}

describe('Step2_StructuredForm', () => {
  it('pre-fills title field with data.title', () => {
    render(<Step2_StructuredForm data={sampleData} onGenerate={vi.fn()} loading={false} error={null} />)
    expect(screen.getByDisplayValue('Hire Designer vs. Contract Agency')).toBeInTheDocument()
  })

  it('pre-fills context field with data.context', () => {
    render(<Step2_StructuredForm data={sampleData} onGenerate={vi.fn()} loading={false} error={null} />)
    expect(screen.getByDisplayValue('We need design resources ahead of Q3 launch.')).toBeInTheDocument()
  })

  it('renders both option names', () => {
    render(<Step2_StructuredForm data={sampleData} onGenerate={vi.fn()} loading={false} error={null} />)
    expect(screen.getByDisplayValue('Full-time hire')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Contract agency')).toBeInTheDocument()
  })

  it('calls onGenerate with updated data when form is submitted', () => {
    const onGenerate = vi.fn()
    render(<Step2_StructuredForm data={sampleData} onGenerate={onGenerate} loading={false} error={null} />)
    fireEvent.change(screen.getByDisplayValue('Hire Designer vs. Contract Agency'), {
      target: { value: 'Updated Title for the Decision' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate memo/i }))
    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated Title for the Decision' })
    )
  })

  it('disables button and shows loading text when loading=true', () => {
    render(<Step2_StructuredForm data={sampleData} onGenerate={vi.fn()} loading={true} error={null} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveTextContent(/generating/i)
  })

  it('shows error with Try again button when error is set', () => {
    render(<Step2_StructuredForm data={sampleData} onGenerate={vi.fn()} loading={false} error="Parse failed" />)
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/components/Step2_StructuredForm.test.jsx
```
Expected: All 6 tests FAIL.

- [ ] **Step 3: Implement Step2_StructuredForm**

```jsx
// decision-memo/src/components/Step2_StructuredForm.jsx
import React, { useState } from 'react'

export default function Step2_StructuredForm({ data, onGenerate, loading, error }) {
  const [form, setForm] = useState(() => ({
    ...data,
    options: data.options.map(o => ({ ...o })),
    constraints: [...(data.constraints || [])],
    stakeholders: [...(data.stakeholders || [])],
  }))

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function updateOption(index, field, value) {
    setForm(f => ({
      ...f,
      options: f.options.map((o, i) => i === index ? { ...o, [field]: value } : o),
    }))
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Review the details</h2>
      <p className="text-sm text-gray-500 mb-6">Edit anything the AI got wrong before generating the memo.</p>

      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Decision Title</label>
      <input
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.title}
        onChange={e => updateField('title', e.target.value)}
      />

      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Context</label>
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={form.context}
        onChange={e => updateField('context', e.target.value)}
      />

      <h3 className="text-sm font-semibold text-gray-700 mb-3">Options</h3>
      {form.options.map((opt, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={opt.name}
            onChange={e => updateOption(i, 'name', e.target.value)}
          />
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={opt.description}
            onChange={e => updateOption(i, 'description', e.target.value)}
          />
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded px-4 py-3 mb-4 text-sm text-red-700">
          Something went wrong.{' '}
          <button className="underline font-medium" onClick={() => onGenerate(form)}>
            Try again
          </button>
        </div>
      )}

      <button
        onClick={() => onGenerate(form)}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-6 py-2.5 text-sm font-medium"
      >
        {loading ? 'Generating…' : 'Generate Memo'}
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/components/Step2_StructuredForm.test.jsx
```
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/components/Step2_StructuredForm.jsx decision-memo/src/components/Step2_StructuredForm.test.jsx
git commit -m "feat: add Step2_StructuredForm component"
```

---

### Task 8: RiskBadge Component

**Files:**
- Create: `decision-memo/src/components/RiskBadge.jsx`
- Create: `decision-memo/src/components/RiskBadge.test.jsx`

Clickable badge. Cycles `Low` (green) → `Medium` (yellow) → `High` (red) → `Low` on click. Calls `onChange(newValue)`.

- [ ] **Step 1: Write failing tests**

```jsx
// decision-memo/src/components/RiskBadge.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RiskBadge from './RiskBadge.jsx'

describe('RiskBadge', () => {
  it('renders "Low" with green styling', () => {
    render(<RiskBadge value="Low" onChange={vi.fn()} />)
    const badge = screen.getByText('Low')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toMatch(/green/)
  })

  it('renders "Medium" with yellow styling', () => {
    render(<RiskBadge value="Medium" onChange={vi.fn()} />)
    expect(screen.getByText('Medium').className).toMatch(/yellow/)
  })

  it('renders "High" with red styling', () => {
    render(<RiskBadge value="High" onChange={vi.fn()} />)
    expect(screen.getByText('High').className).toMatch(/red/)
  })

  it('cycles Low → Medium on click', () => {
    const onChange = vi.fn()
    render(<RiskBadge value="Low" onChange={onChange} />)
    fireEvent.click(screen.getByText('Low'))
    expect(onChange).toHaveBeenCalledWith('Medium')
  })

  it('cycles Medium → High on click', () => {
    const onChange = vi.fn()
    render(<RiskBadge value="Medium" onChange={onChange} />)
    fireEvent.click(screen.getByText('Medium'))
    expect(onChange).toHaveBeenCalledWith('High')
  })

  it('cycles High → Low on click', () => {
    const onChange = vi.fn()
    render(<RiskBadge value="High" onChange={onChange} />)
    fireEvent.click(screen.getByText('High'))
    expect(onChange).toHaveBeenCalledWith('Low')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/components/RiskBadge.test.jsx
```
Expected: All 6 tests FAIL.

- [ ] **Step 3: Implement RiskBadge**

```jsx
// decision-memo/src/components/RiskBadge.jsx
import React from 'react'

const CYCLE = ['Low', 'Medium', 'High']

const STYLES = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-red-100 text-red-800 border-red-200',
}

export default function RiskBadge({ value, onChange }) {
  function handleClick() {
    const next = CYCLE[(CYCLE.indexOf(value) + 1) % CYCLE.length]
    onChange(next)
  }

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium cursor-pointer select-none ${STYLES[value] ?? STYLES.Medium}`}
      title="Click to change risk level"
    >
      {value}
    </span>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/components/RiskBadge.test.jsx
```
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/components/RiskBadge.jsx decision-memo/src/components/RiskBadge.test.jsx
git commit -m "feat: add RiskBadge with cycling Low/Medium/High"
```

---

### Task 9: OptionCard Component

**Files:**
- Create: `decision-memo/src/components/OptionCard.jsx`
- Create: `decision-memo/src/components/OptionCard.test.jsx`

One option block in the memo document. Name and description are `contenteditable`. Pros/cons each have per-bullet `×` (delete) and a `+` (add) button. Risk badge cycles on click. All changes call `onChange(updatedOption)`.

- [ ] **Step 1: Write failing tests**

```jsx
// decision-memo/src/components/OptionCard.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OptionCard from './OptionCard.jsx'

const sampleOption = {
  name: 'Full-time hire',
  description: 'Bring a senior designer onto payroll for ongoing work.',
  pros: ['Long-term investment in the team', 'Deep product knowledge over time'],
  cons: ['Higher upfront cost and commitment', 'Longer hiring timeline required'],
  risk: 'Low',
}

describe('OptionCard', () => {
  it('renders option name', () => {
    render(<OptionCard option={sampleOption} onChange={vi.fn()} />)
    expect(screen.getByText('Full-time hire')).toBeInTheDocument()
  })

  it('renders all pros', () => {
    render(<OptionCard option={sampleOption} onChange={vi.fn()} />)
    expect(screen.getByText('Long-term investment in the team')).toBeInTheDocument()
    expect(screen.getByText('Deep product knowledge over time')).toBeInTheDocument()
  })

  it('renders all cons', () => {
    render(<OptionCard option={sampleOption} onChange={vi.fn()} />)
    expect(screen.getByText('Higher upfront cost and commitment')).toBeInTheDocument()
  })

  it('renders risk badge', () => {
    render(<OptionCard option={sampleOption} onChange={vi.fn()} />)
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('calls onChange with cycled risk when badge is clicked', () => {
    const onChange = vi.fn()
    render(<OptionCard option={sampleOption} onChange={onChange} />)
    fireEvent.click(screen.getByText('Low'))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ risk: 'Medium' }))
  })

  it('calls onChange with one fewer pro when a pro × button is clicked', () => {
    const onChange = vi.fn()
    render(<OptionCard option={sampleOption} onChange={onChange} />)
    const deleteButtons = screen.getAllByTitle('Remove')
    fireEvent.click(deleteButtons[0])
    expect(onChange.mock.calls[0][0].pros).toHaveLength(1)
  })

  it('calls onChange with one more pro when + Add is clicked in pros section', () => {
    const onChange = vi.fn()
    render(<OptionCard option={sampleOption} onChange={onChange} />)
    const addButtons = screen.getAllByTitle('Add')
    fireEvent.click(addButtons[0])
    expect(onChange.mock.calls[0][0].pros).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/components/OptionCard.test.jsx
```
Expected: All 7 tests FAIL.

- [ ] **Step 3: Implement OptionCard**

```jsx
// decision-memo/src/components/OptionCard.jsx
import React from 'react'
import RiskBadge from './RiskBadge.jsx'

function BulletList({ items, onUpdate, onAdd, onRemove }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-1 group">
          <span className="text-gray-400 mt-0.5 shrink-0">·</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={e => onUpdate(i, e.currentTarget.textContent)}
            className="flex-1 outline-none focus:bg-blue-50 rounded px-0.5 text-sm"
          >
            {item}
          </span>
          <button
            title="Remove"
            onClick={() => onRemove(i)}
            className="text-gray-300 hover:text-red-400 print:hidden text-xs opacity-0 group-hover:opacity-100 shrink-0"
          >
            ×
          </button>
        </li>
      ))}
      <li>
        <button
          title="Add"
          onClick={onAdd}
          className="text-blue-400 hover:text-blue-600 text-xs print:hidden"
        >
          + Add
        </button>
      </li>
    </ul>
  )
}

export default function OptionCard({ option, onChange }) {
  function update(field, value) {
    onChange({ ...option, [field]: value })
  }

  function updateBullet(list, index, value) {
    onChange({ ...option, [list]: option[list].map((item, i) => i === index ? value : item) })
  }

  function addBullet(list) {
    onChange({ ...option, [list]: [...option[list], 'New item'] })
  }

  function removeBullet(list, index) {
    onChange({ ...option, [list]: option[list].filter((_, i) => i !== index) })
  }

  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={e => update('name', e.currentTarget.textContent)}
          className="font-semibold text-gray-900 outline-none focus:bg-blue-50 rounded px-0.5"
        >
          {option.name}
        </span>
        <RiskBadge value={option.risk} onChange={risk => update('risk', risk)} />
      </div>
      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={e => update('description', e.currentTarget.textContent)}
        className="text-sm text-gray-600 mb-4 outline-none focus:bg-blue-50 rounded px-0.5"
      >
        {option.description}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Pros</p>
          <BulletList
            items={option.pros}
            onUpdate={(i, v) => updateBullet('pros', i, v)}
            onAdd={() => addBullet('pros')}
            onRemove={i => removeBullet('pros', i)}
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Cons</p>
          <BulletList
            items={option.cons}
            onUpdate={(i, v) => updateBullet('cons', i, v)}
            onAdd={() => addBullet('cons')}
            onRemove={i => removeBullet('cons', i)}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/components/OptionCard.test.jsx
```
Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/components/OptionCard.jsx decision-memo/src/components/OptionCard.test.jsx
git commit -m "feat: add OptionCard with contenteditable fields and bullet add/remove"
```

---

### Task 10: Step3_Memo Component

**Files:**
- Create: `decision-memo/src/components/Step3_Memo.jsx`
- Create: `decision-memo/src/components/Step3_Memo.test.jsx`

The full document view. All text is `contenteditable`. "Prepared for" and "Prepared by" default to italic muted placeholder text that clears on first click and restores if left empty on blur. Recommendation section shows "AI Draft — edit before sharing" label (hidden in print). Export PDF button calls `window.print()` (hidden in print).

- [ ] **Step 1: Write failing tests**

```jsx
// decision-memo/src/components/Step3_Memo.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Step3_Memo from './Step3_Memo.jsx'

const sampleMemo = {
  context: 'The company needs design resources ahead of the Q3 product launch.',
  options: [
    {
      name: 'Full-time hire',
      description: 'Bring a senior designer onto payroll for ongoing work.',
      pros: ['Long-term investment in the team', 'Deep product knowledge over time'],
      cons: ['Higher upfront cost and commitment', 'Longer hiring timeline required'],
      risk: 'Low',
    },
  ],
  recommendation: 'We recommend hiring full-time given the long-term design needs of the product.',
  nextSteps: ['Post job description by May 15', 'Interview shortlisted candidates in June'],
}

describe('Step3_Memo', () => {
  it('renders the DECISION MEMO header', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText(/decision memo/i)).toBeInTheDocument()
  })

  it('renders the decision title', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText('Hire Designer vs. Contract')).toBeInTheDocument()
  })

  it('renders placeholder for "Prepared for" field', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText('[ Executive Name ]')).toBeInTheDocument()
  })

  it('renders placeholder for "Prepared by" field', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText('[ Your Name ]')).toBeInTheDocument()
  })

  it('renders the BACKGROUND section with context text', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText(/Q3 product launch/)).toBeInTheDocument()
  })

  it('renders the recommendation text', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText(/long-term design needs/)).toBeInTheDocument()
  })

  it('renders the AI Draft warning label', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText(/ai draft/i)).toBeInTheDocument()
  })

  it('renders the Export PDF button', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument()
  })

  it('calls window.print on Export PDF click', () => {
    const print = vi.fn()
    vi.stubGlobal('print', print)
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    fireEvent.click(screen.getByRole('button', { name: /export pdf/i }))
    expect(print).toHaveBeenCalled()
  })

  it('renders next steps', () => {
    render(<Step3_Memo memo={sampleMemo} title="Hire Designer vs. Contract" />)
    expect(screen.getByText('Post job description by May 15')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose src/components/Step3_Memo.test.jsx
```
Expected: All 10 tests FAIL.

- [ ] **Step 3: Implement Step3_Memo**

```jsx
// decision-memo/src/components/Step3_Memo.jsx
import React, { useState } from 'react'
import OptionCard from './OptionCard.jsx'

function Placeholder({ defaultText, className = '' }) {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState('')

  if (active || value) {
    return (
      <span
        contentEditable
        suppressContentEditableWarning
        autoFocus={active && !value}
        onBlur={e => {
          const text = e.currentTarget.textContent.trim()
          setValue(text)
          if (!text) setActive(false)
        }}
        className={`outline-none focus:bg-blue-50 rounded px-0.5 ${className}`}
      >
        {value || defaultText}
      </span>
    )
  }

  return (
    <span
      onClick={() => setActive(true)}
      className={`italic text-gray-400 cursor-text rounded px-0.5 hover:bg-blue-50 ${className}`}
    >
      {defaultText}
    </span>
  )
}

function EditableBulletList({ items, onUpdate, onAdd, onRemove }) {
  return (
    <ul className="space-y-1 ml-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-1 group">
          <span className="text-gray-400 mt-0.5 shrink-0">·</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={e => onUpdate(i, e.currentTarget.textContent)}
            className="flex-1 outline-none focus:bg-blue-50 rounded px-0.5 text-sm"
          >
            {item}
          </span>
          <button
            onClick={() => onRemove(i)}
            className="text-gray-300 hover:text-red-400 print:hidden text-xs opacity-0 group-hover:opacity-100"
          >
            ×
          </button>
        </li>
      ))}
      <li>
        <button
          onClick={onAdd}
          className="text-blue-400 hover:text-blue-600 text-xs print:hidden"
        >
          + Add
        </button>
      </li>
    </ul>
  )
}

export default function Step3_Memo({ memo, title }) {
  const [options, setOptions] = useState(memo.options)
  const [nextSteps, setNextSteps] = useState(memo.nextSteps)

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  function updateOption(index, updated) {
    setOptions(opts => opts.map((o, i) => i === index ? updated : o))
  }

  function updateNextStep(index, value) {
    setNextSteps(steps => steps.map((s, i) => i === index ? value : s))
  }

  function addNextStep() {
    setNextSteps(steps => [...steps, 'New action item'])
  }

  function removeNextStep(index) {
    setNextSteps(steps => steps.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-5 py-2 text-sm font-medium"
        >
          Export PDF
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 font-serif">
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase">Decision Memo</p>
          <p className="text-xs text-gray-400">{today}</p>
        </div>
        <hr className="border-gray-300 mb-4" />

        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm mb-6">
          <span className="text-gray-500 font-medium">Decision:</span>
          <span
            contentEditable
            suppressContentEditableWarning
            className="font-semibold text-gray-900 outline-none focus:bg-blue-50 rounded px-0.5"
          >
            {title}
          </span>

          <span className="text-gray-500 font-medium">Prepared for:</span>
          <Placeholder defaultText="[ Executive Name ]" className="text-gray-900" />

          <span className="text-gray-500 font-medium">Prepared by:</span>
          <Placeholder defaultText="[ Your Name ]" className="text-gray-900" />
        </div>

        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Background</h2>
        <p
          contentEditable
          suppressContentEditableWarning
          className="text-sm text-gray-700 leading-relaxed mb-6 outline-none focus:bg-blue-50 rounded px-0.5"
        >
          {memo.context}
        </p>

        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Options</h2>
        <div className="mb-6">
          {options.map((opt, i) => (
            <OptionCard key={i} option={opt} onChange={updated => updateOption(i, updated)} />
          ))}
        </div>

        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Recommendation</h2>
        <p className="text-xs text-amber-600 font-medium mb-2 print:hidden">
          ⚠ AI Draft — edit before sharing
        </p>
        <p
          contentEditable
          suppressContentEditableWarning
          className="text-sm text-gray-700 leading-relaxed mb-6 outline-none focus:bg-blue-50 rounded px-0.5"
        >
          {memo.recommendation}
        </p>

        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Next Steps</h2>
        <EditableBulletList
          items={nextSteps}
          onUpdate={updateNextStep}
          onAdd={addNextStep}
          onRemove={removeNextStep}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose src/components/Step3_Memo.test.jsx
```
Expected: All 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/components/Step3_Memo.jsx decision-memo/src/components/Step3_Memo.test.jsx
git commit -m "feat: add Step3_Memo document view with contenteditable fields and PDF export"
```

---

### Task 11: App.jsx Wire-Up and print.css

**Files:**
- Modify: `decision-memo/src/App.jsx`
- Modify: `decision-memo/src/styles/print.css`

Wire all steps together. App manages `step` (1 | 2 | 3), `structuredData`, and `memoData` state. Print CSS hides controls and sets page margins.

- [ ] **Step 1: Write full App.jsx**

```jsx
// decision-memo/src/App.jsx
import React, { useState } from 'react'
import ApiKeyGate from './components/ApiKeyGate.jsx'
import Step1_FreeText from './components/Step1_FreeText.jsx'
import Step2_StructuredForm from './components/Step2_StructuredForm.jsx'
import Step3_Memo from './components/Step3_Memo.jsx'
import { useClaude } from './hooks/useClaude.js'
import { EXTRACT_STRUCTURE_SYSTEM, buildExtractStructurePrompt } from './prompts/extractStructure.js'
import { GENERATE_MEMO_SYSTEM, buildGenerateMemoPrompt } from './prompts/generateMemo.js'
import { validateStructure } from './utils/validateStructure.js'
import { validateMemo } from './utils/validateMemo.js'

export default function App() {
  const [step, setStep] = useState(1)
  const [structuredData, setStructuredData] = useState(null)
  const [memoData, setMemoData] = useState(null)
  const { loading, error, call } = useClaude()

  async function handleAnalyse(freeText) {
    try {
      const result = await call(
        EXTRACT_STRUCTURE_SYSTEM,
        buildExtractStructurePrompt(freeText)
      )
      if (!validateStructure(result)) {
        throw new Error('Response validation failed — required fields missing or too short.')
      }
      setStructuredData(result)
      setStep(2)
    } catch {
      // error state set by useClaude; stay on step 1
    }
  }

  async function handleGenerate(formData) {
    try {
      const result = await call(
        GENERATE_MEMO_SYSTEM,
        buildGenerateMemoPrompt(formData)
      )
      if (!validateMemo(result)) {
        throw new Error('Response validation failed — required fields missing or too short.')
      }
      setMemoData(result)
      setStep(3)
    } catch {
      // error state set by useClaude; stay on step 2
    }
  }

  return (
    <ApiKeyGate>
      <div className="min-h-screen bg-gray-50">
        {step === 1 && (
          <Step1_FreeText onAnalyse={handleAnalyse} loading={loading} error={error} />
        )}
        {step === 2 && structuredData && (
          <Step2_StructuredForm
            data={structuredData}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
          />
        )}
        {step === 3 && memoData && (
          <Step3_Memo memo={memoData} title={structuredData.title} />
        )}
      </div>
    </ApiKeyGate>
  )
}
```

- [ ] **Step 2: Write print.css**

```css
/* decision-memo/src/styles/print.css */
@media print {
  body {
    background: white;
  }

  .print\:hidden {
    display: none !important;
  }

  [contenteditable] {
    outline: none !important;
    background: transparent !important;
  }

  .border.border-gray-200.rounded-lg {
    break-inside: avoid;
  }

  @page {
    margin: 1.5cm 2cm;
  }
}
```

- [ ] **Step 3: Run the full test suite**

```bash
npm test
```
Expected: All tests across all files PASS.

- [ ] **Step 4: Start dev server and smoke test manually**

```bash
npm run dev
```

Open the printed local URL and verify:
1. API key gate appears on first load, accepts a key (any non-empty string for dev), stores it, reveals Step 1
2. Type a decision description (e.g. "We need to decide whether to renew our office lease or go fully remote. Lease expires in 3 months."), click Analyse — loading state shows, then Step 2 loads with pre-filled form
3. Edit a field in Step 2, click Generate Memo — Step 3 loads with the memo document
4. In Step 3: click on the decision title text to edit it inline; click a pro bullet text to edit it; click × next to a bullet to delete it; click `+ Add` to add a new bullet; click the risk badge to cycle it
5. "Prepared for" shows `[ Executive Name ]` in italic — click it, it becomes editable; clear it and blur, the placeholder restores
6. Click Export PDF — browser print dialog opens; confirm that controls (Export PDF button, × and + buttons, AI Draft label) do not appear in the print preview

- [ ] **Step 5: Commit**

```bash
git add decision-memo/src/App.jsx decision-memo/src/styles/print.css
git commit -m "feat: wire up full Decision Memo Generator app"
```

---

## Self-Review

**Spec coverage:**
- ✅ Web app (React + Vite + Tailwind)
- ✅ Free text → AI extract → structured form (Step 1 → Step 2)
- ✅ User reviews/edits structured form before generating (Step2_StructuredForm)
- ✅ Memo renders as styled document (Step3_Memo)
- ✅ All Step 3 fields are `contenteditable` — no `<input>` or `<textarea>` elements
- ✅ "Prepared for" / "Prepared by" default to `[ Executive Name ]` / `[ Your Name ]` in italic muted style; restore on empty blur
- ✅ Pros/cons bullets: per-bullet `×` delete and `+` add button (print:hidden)
- ✅ Risk badge: `Low` / `Medium` / `High` fixed enum, color-coded green/yellow/red, cycles on click
- ✅ Recommendation labeled "⚠ AI Draft — edit before sharing" (screen only, print:hidden)
- ✅ PDF export via `window.print()` — Export PDF button is print:hidden
- ✅ Claude API key stored in localStorage, prompted via ApiKeyGate on first use
- ✅ Validation: required string fields empty or <10 chars → parse failure → "Try again" error; Step 2 form data preserved
- ✅ Prompt prefix nudge: "Begin your response with {"
- ✅ Invalid risk value → normalised to `"Medium"` silently (validateMemo)
- ✅ Two Claude API calls: extractStructure (Step 1→2) and generateMemo (Step 2→3)
- ✅ User's Step 2 form data preserved on generate error (error shown inline with Try again)

**Placeholder scan:** No TBDs, TODOs, "similar to above" references, or incomplete steps found.

**Type consistency:**
- `validateStructure` / `validateMemo` — defined in `utils/`, imported identically in `App.jsx`
- `useClaude` returns `{ loading, error, call }` — consumed as-is in `App.jsx`
- `OptionCard` props: `{ option, onChange }` — matched in `Step3_Memo.jsx`
- `RiskBadge` props: `{ value, onChange }` — matched in `OptionCard.jsx`
- `EXTRACT_STRUCTURE_SYSTEM` + `buildExtractStructurePrompt` — exported from `prompts/extractStructure.js`, imported in `App.jsx`
- `GENERATE_MEMO_SYSTEM` + `buildGenerateMemoPrompt` — exported from `prompts/generateMemo.js`, imported in `App.jsx`
- `BulletList` component in `OptionCard.jsx` and `EditableBulletList` in `Step3_Memo.jsx` are separate local components — no cross-file naming conflict
