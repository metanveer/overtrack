"use client";

import DownloadPdfButton from "./DownloadPdfButton";
import formatMonthName from "@/utils/formatMonthName";
import { transformOTMonthlySummary } from "@/utils/transformOtMonthlySummary";
import { downloadMonthlySummaryReport } from "@/utils/pdf-download/downloadMonthlySummaryReport";

const MonthlySummary = ({ data, employeeOrder, month, dept, isDashboard }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-xl">
        {"No overtime data available for the current month."}
      </div>
    );
  }

  const {
    allDates,
    employeeList,
    employeeMap,
    dayTotals,
    grandTotal,
    topThree,
  } = transformOTMonthlySummary(data, employeeOrder);

  const monthName = formatMonthName(month);

  return (
    <div>
      <div className="text-2xl font-bold my-3 text-center">
        {isDashboard
          ? "Current Month Overtime Hours"
          : `Monthly OT Summary for ${monthName}`}
      </div>
      {!isDashboard && (
        <div className="mb-2">
          <DownloadPdfButton
            onClick={() =>
              downloadMonthlySummaryReport(data, employeeOrder, monthName, dept)
            }
          />
        </div>
      )}
      <div
        className={`rounded-xl overflow-hidden bg-white shadow mx-auto ${
          isDashboard ? "max-w-2xl" : ""
        }`}
      >
        <div className="overflow-auto bg-white p-4 rounded-xl shadow">
          <table className="min-w-full border-collapse border border-gray-300 text-sm text-center">
            <thead className="bg-white">
              <tr>
                <th className="border border-gray-300 px-2 py-1">#</th>
                <th className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  Employee Name
                </th>
                {!isDashboard &&
                  allDates.map((date) => (
                    <th key={date} className="border border-gray-300 px-2 py-1">
                      {`${date.slice(8)}`}
                    </th>
                  ))}
                <th className="border border-gray-300 px-2 py-1 font-semibold">
                  Total Hrs
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((name, index) => {
                const isTop = topThree.has(name);
                return (
                  <tr
                    key={name}
                    className={isTop ? "bg-yellow-100 font-medium" : ""}
                  >
                    <td className="border border-gray-300 px-2 py-1">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 whitespace-nowrap text-left">
                      {name}
                    </td>
                    {!isDashboard &&
                      allDates.map((date) => (
                        <td
                          key={date}
                          className="border border-gray-300 px-2 py-1"
                        >
                          {employeeMap[name][date] || ""}
                        </td>
                      ))}
                    <td
                      className={`border border-gray-300 px-2 py-1 ${
                        isTop ? "bg-yellow-300 font-semibold" : ""
                      }`}
                    >
                      {employeeMap[name].total}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-200 font-semibold">
                <td className="border border-gray-300 px-2 py-1"></td>
                <td className="border border-gray-300 px-2 py-1 text-left">
                  {isDashboard ? "Monthly Grand Total" : "Total Per Day"}
                </td>
                {!isDashboard &&
                  allDates.map((date) => (
                    <td key={date} className="border border-gray-300 px-2 py-1">
                      {dayTotals[date]}
                    </td>
                  ))}
                <td className="border border-gray-300 px-2 py-1">
                  {grandTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
