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
