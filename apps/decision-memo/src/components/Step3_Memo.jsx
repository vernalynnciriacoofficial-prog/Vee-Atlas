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
