"use client";
import { downloadPdfDailyReport } from "@/utils/downloadPdf";
import { Download } from "lucide-react";

export default function DownloadPdfButton({ records, date }) {
  return (
    <button
      onClick={() => downloadPdfDailyReport(records, date)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
    >
      <Download className="w-5 h-5" />
      <span>Download as PDF</span>
    </button>
  );
}
