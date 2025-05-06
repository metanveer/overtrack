"use client";

import DownloadPdfButton from "./DownloadPdfButton";
import formatMonthName from "@/utils/formatMonthName";
import { transformOTMonthlySummary } from "@/utils/transformOtMonthlySummary";
import { downloadMonthlySummaryReport } from "@/utils/pdf-download/downloadMonthlySummaryReport";

const MonthlySummary = ({ data, employeeOrder, month, dept, isDashboard }) => {
  const {
    allDates,
    employeeList,
    employeeMap,
    dayTotals,
    grandTotal,
    topThree,
  } = transformOTMonthlySummary(data, employeeOrder);

  const monthName = formatMonthName(month);

  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay(); // 5 = Friday, 6 = Saturday
    return day === 5 || day === 6;
  };

  return (
    <div>
      <div className="text-2xl font-bold my-3 text-center text-gray-700">
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
              {isDashboard ? null : (
                <tr>
                  <th className=" px-2 py-1"></th>
                  <th className=" px-2 py-1"></th>
                  {!isDashboard &&
                    allDates.map((date) => {
                      const dayLetter = new Date(date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      )[0];
                      const weekend = isWeekend(date);
                      return (
                        <th
                          key={`day-${date}`}
                          className={`border border-gray-300 px-2 py-1 ${
                            weekend
                              ? "bg-red-100 text-red-600 font-semibold"
                              : ""
                          }`}
                        >
                          {dayLetter}
                        </th>
                      );
                    })}
                  <th className="border border-gray-300 px-2 py-1"></th>
                </tr>
              )}
              <tr>
                <th className="border border-gray-300 px-2 py-1">#</th>
                <th className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  Employee Name
                </th>
                {!isDashboard &&
                  allDates.map((date) => {
                    const weekend = isWeekend(date);
                    return (
                      <th
                        key={date}
                        className={`border border-gray-300 px-2 py-1 ${
                          weekend ? "bg-red-100 text-red-600 font-semibold" : ""
                        }`}
                      >
                        {`${date.slice(8)}`}
                      </th>
                    );
                  })}
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
                      allDates.map((date) => {
                        const weekend = isWeekend(date);
                        return (
                          <td
                            key={date}
                            className={`border border-gray-300 px-2 py-1 ${
                              weekend ? "bg-red-100 text-red-600" : ""
                            } ${
                              isTop
                                ? "bg-yellow-100 z-10 relative font-semibold"
                                : ""
                            }`}
                          >
                            {employeeMap[name][date] || ""}
                          </td>
                        );
                      })}
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
                  allDates.map((date) => {
                    const weekend = isWeekend(date);
                    return (
                      <td
                        key={date}
                        className={`border border-gray-300 px-2 py-1 ${
                          weekend ? "bg-red-100 text-red-600 font-semibold" : ""
                        }`}
                      >
                        {dayTotals[date]}
                      </td>
                    );
                  })}
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
