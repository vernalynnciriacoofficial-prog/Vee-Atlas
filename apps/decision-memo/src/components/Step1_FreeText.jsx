import { useState } from 'react';
import { useClaude } from '../hooks/useClaude';
import { buildExtractStructurePrompt } from '../prompts/extractStructure';
import { validateExtractStructure } from '../utils/validateJson';
import { DEMO_EXTRACT } from '../demo';

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
    } catch (err) {
      setError(err?.message || 'Could not parse the response. Please try again.');
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
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleAnalyse}
            disabled={loading || text.trim().length < 20}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-40 text-sm font-medium"
          >
            {loading ? 'Analysing…' : 'Analyse →'}
          </button>
          <button
            onClick={() => onComplete(DEMO_EXTRACT)}
            disabled={loading}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-500 disabled:opacity-40"
          >
            Try demo
          </button>
        </div>
      </div>
    </div>
  );
}
