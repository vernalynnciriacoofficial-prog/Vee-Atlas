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
