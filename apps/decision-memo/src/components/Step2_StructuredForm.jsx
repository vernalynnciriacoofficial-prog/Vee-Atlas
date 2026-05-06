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
    } catch (err) {
      setError(err?.message || 'Could not generate the memo. Please try again.');
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
