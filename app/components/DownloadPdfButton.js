import { Download } from "lucide-react";

export default function DownloadPdfButton({ onClick, label = "Download PDF" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer"
    >
      <Download className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
