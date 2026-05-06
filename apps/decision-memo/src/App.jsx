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
