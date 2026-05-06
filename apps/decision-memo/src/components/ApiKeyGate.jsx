import { useState } from 'react';

export default function ApiKeyGate({ onSubmit, onDemo }) {
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
          Describe a decision, get a structured one-pager with options, pros/cons, and a recommendation.
        </p>

        <button
          onClick={onDemo}
          className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 text-sm font-medium mb-4"
        >
          Try demo — no key needed →
        </button>

        <div className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">or use your own API key</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sk-ant-..."
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 disabled:opacity-40 text-sm font-medium"
          >
            Continue with API key
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Key stored only in your browser — never sent anywhere except Anthropic.
        </p>
      </div>
    </div>
  );
}
