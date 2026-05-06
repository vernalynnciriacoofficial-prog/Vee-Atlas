export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-900 text-sm font-medium"
    >
      Export PDF
    </button>
  );
}
