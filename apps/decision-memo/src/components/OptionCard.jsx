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
