# Decision Memo Generator — Design Spec

**Date:** 2026-05-05
**Project:** Vee Atlas
**Status:** Approved

---

## Overview

A client-side web app that turns a free-text description of an executive decision into a structured, print-ready one-pager. The user describes the decision in plain language, the AI extracts structured data for review, and then generates a formatted memo the user can edit inline and export to PDF.

---

## Architecture & Flow

**Stack:** React + Vite + Tailwind CSS. Static site, no backend. The Claude API is called directly from the browser. The API key is entered once and stored in `localStorage`.

**Three-step flow:**

```
Step 1 — Free Text Input
  User types a plain-language description of the decision.
  → "Analyse" button → Claude API call #1 (extractStructure)

Step 2 — Review Structured Form
  AI pre-fills: title, context, constraints, stakeholders, options (name + description).
  User reviews and edits any fields before proceeding.
  → "Generate Memo" button → Claude API call #2 (generateMemo)

Step 3 — Editable Memo Document
  Full one-pager renders as a styled document.
  All text is editable via contenteditable — clicking text edits it directly.
  Recommendation section is labeled "AI Draft — edit before sharing."
  → "Export PDF" triggers window.print() with print CSS.
```

---

## Components & File Structure

```
src/
  App.jsx                    — root; manages current step + API key state
  components/
    ApiKeyGate.jsx           — first-run prompt; stores key in localStorage
    Step1_FreeText.jsx       — textarea + "Analyse" button + loading state
    Step2_StructuredForm.jsx — editable form: title, context, constraints,
                               stakeholders, options list (add/remove options)
    Step3_Memo.jsx           — the document; all text via contenteditable
    MemoSection.jsx          — reusable section block (heading + editable body)
    OptionCard.jsx           — one option: name, description, pros, cons, risk badge
    ExportButton.jsx         — triggers window.print()
  hooks/
    useClaude.js             — wraps both API calls; exposes { loading, error, call }
  prompts/
    extractStructure.js      — system + user prompt for call #1
    generateMemo.js          — system + user prompt for call #2
  styles/
    print.css                — @media print rules: hide controls, page margins,
                               force black text, page-break rules
```

**Key constraint:** `Step3_Memo.jsx` contains zero `<input>` or `<textarea>` elements. Every editable field is a `div` or `span` with `contenteditable="true"`. Export controls and the "AI Draft" label are hidden via `print:hidden`.

---

## Memo Structure (One-Pager Layout)

```
┌─────────────────────────────────────────────────────┐
│  DECISION MEMO                          [date]       │
│  ─────────────────────────────────────────────────  │
│  Decision:      [title — contenteditable]            │
│  Prepared for:  [ Executive Name ] (placeholder)     │
│  Prepared by:   [ Your Name ] (placeholder)          │
├─────────────────────────────────────────────────────┤
│  BACKGROUND                                          │
│  [context paragraph — contenteditable]               │
├─────────────────────────────────────────────────────┤
│  OPTIONS                                             │
│  ┌───────────────────────────────────────────────┐  │
│  │ Option 1: [name]              [Risk: LOW ●]   │  │
│  │ [description — contenteditable]               │  │
│  │ Pros  · [bullet ×] · [bullet ×]  [+]         │  │
│  │ Cons  · [bullet ×] · [bullet ×]  [+]         │  │
│  └───────────────────────────────────────────────┘  │
│  (one OptionCard per option)                         │
├─────────────────────────────────────────────────────┤
│  RECOMMENDATION  ⚠ AI Draft — edit before sharing   │
│  [recommendation text — contenteditable]             │
├─────────────────────────────────────────────────────┤
│  NEXT STEPS                                          │
│  · [step — contenteditable]                          │
│  · [step — contenteditable]                          │
└─────────────────────────────────────────────────────┘
                              [Export PDF]  (print:hidden)
```

**Placeholder fields (`[ Executive Name ]`, `[ Your Name ]`):**
- Render in italic, muted color (`text-gray-400 italic`) to signal they need editing.
- On `focus`: if the field's text matches the placeholder exactly, clear it and switch to normal styling.
- On `blur`: if the field is empty, restore the placeholder text and muted italic style.
- This mimics native `placeholder` behavior (which does not work on `contenteditable` elements).

**Date:** Auto-fills to today's date; `contenteditable` so the user can change it if needed.

**Risk badge (in OptionCard):**
- Fixed enum: `"Low" | "Medium" | "High"`.
- Styled: Low → `bg-green-100 text-green-800`, Medium → `bg-yellow-100 text-yellow-800`, High → `bg-red-100 text-red-800`.
- Clicking the badge cycles through: Low → Medium → High → Low.
- Not `contenteditable` — it is a button/toggle element.

**Pro/con bullets:**
- Each bullet: `· [contenteditable span] [× delete button]`
- Below each list: `[+ Add]` button appends a new empty bullet.
- `×` and `+` controls are `print:hidden`.

---

## Claude Prompt Contracts

### Call #1 — `extractStructure(freeText)`

**Prompt instructions:**
- Return 2–4 options minimum.
- No markdown outside the JSON object.
- If the input is too vague to name specific options, use `"Option A"`, `"Option B"` as placeholders.
- Begin your response with `{`.

**Expected response shape:**
```json
{
  "title": "string",
  "context": "string",
  "constraints": ["string"],
  "stakeholders": ["string"],
  "options": [
    { "name": "string", "description": "string" }
  ]
}
```

### Call #2 — `generateMemo(structuredData)`

**Note on constraints and stakeholders:** These fields are collected in Step 2 and passed to `generateMemo` as generation context. Claude uses them to inform the background paragraph and option risk/pros/cons analysis. They do not appear as separate named sections in the rendered memo.

**Prompt instructions:**
- `risk` must be exactly `"Low"`, `"Medium"`, or `"High"` — no other values.
- 2–4 pros and 2–4 cons per option.
- Recommendation is one concise paragraph.
- No markdown outside the JSON object.
- Begin your response with `{`.

**Expected response shape:**
```json
{
  "context": "string",
  "options": [
    {
      "name": "string",
      "description": "string",
      "pros": ["string"],
      "cons": ["string"],
      "risk": "Low | Medium | High"
    }
  ],
  "recommendation": "string",
  "nextSteps": ["string"]
}
```

---

## Error Handling & Validation

**After JSON.parse, validate all required string fields:**
- If any required string field is empty or under 10 characters, treat it as a parse failure — do not render a broken memo with blank sections.
- Show an inline "Something went wrong — Try again" error.
- Preserve the user's Step 2 form data so they do not lose their edits.

**Risk enum enforcement:**
- If `risk` is outside `"Low" | "Medium" | "High"`, default to `"Medium"` silently.

**API key errors:**
- Invalid key → clear error on `ApiKeyGate`, prompt to re-enter.

**Network failure:**
- Inline error with retry button; Step 2 data preserved.

---

## Styling & Deployment

**Visual design:**
- Memo renders as a white document card on a light gray background.
- `font-serif` for memo body (formal memo feel); `font-sans` for UI chrome.
- Tailwind `prose` plugin for consistent text sizing inside the memo.

**PDF export:**
- `window.print()` with `@media print` in `print.css`.
- Print styles: hide all UI chrome (buttons, step indicators, `×`/`+` controls, "AI Draft" label), set 1in page margins, force `font-size: 11pt`, suppress background colors except risk badges.
- No third-party PDF library required.

**Deployment:**
- `vite build` outputs a static `dist/` folder.
- Zero-config deploy to GitHub Pages, Netlify, or Vercel.
- No server required.
