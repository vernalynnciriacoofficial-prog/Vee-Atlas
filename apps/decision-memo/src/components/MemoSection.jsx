export default function MemoSection({ heading, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 print:text-gray-600">
        {heading}
      </h3>
      {children}
    </div>
  );
}
