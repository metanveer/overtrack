"use client";
import { downloadUnitsSummary } from "@/utils/pdf-download/downloadUnitsSummary";
import DownloadPdfButton from "./DownloadPdfButton";

const UnitsSummaryTable = ({ data, dept }) => {
  // Sort data by totalOtHours in descending order
  const sortedData = [...data].sort((a, b) => b.totalOtHours - a.totalOtHours);

  const totalSum = sortedData.reduce((sum, item) => sum + item.totalOtHours, 0);

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-2xl shadow-lg max-w-lg mx-auto">
        <table className="min-w-full border-collapse bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-indigo-200 text-black text-left text-base">
              <th className="px-6 py-4 font-semibold text-center">Rank</th>
              <th className="px-6 py-4 font-semibold text-center">
                Unit / Work Area
              </th>
              <th className="px-6 py-4 font-semibold text-center">
                Overtime Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-3 font-medium text-center">{idx + 1}</td>
                <td className="px-6 py-3 font-medium text-center">
                  {row.Unit}
                </td>
                <td className="px-6 py-3 text-center">{row.totalOtHours}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 border-t-2 border-gray-300 text-base font-semibold">
              <td className="px-6 py-4 text-center"></td>
              <td className="px-6 py-4 text-center">Total</td>

              <td className="px-6 py-4 text-center">{totalSum}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="my-6">
        <DownloadPdfButton onClick={() => downloadUnitsSummary(data, dept)} />
      </div>
    </div>
  );
};

export default UnitsSummaryTable;
