"use client";
import { downloadYearlyOtSummary } from "@/utils/pdf-download/downloadYearlyOtSummary";
import round1 from "@/utils/round1";
import DownloadPdfButton from "./DownloadPdfButton";

const YearView = ({ billData, reportType, year, dept }) => {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // Monthly totals for all employees
  const monthlyTotals = billData.reduce((acc, emp) => {
    months.forEach((month) => {
      acc[month] = (acc[month] || 0) + (Number(emp[month]) || 0);
    });
    return acc;
  }, {});

  // Get total overtime for each employee
  const getEmployeeTotal = (emp) => {
    return months.reduce((sum, month) => sum + (Number(emp[month]) || 0), 0);
  };

  // Total of all employees' totals
  const overallTotal = Object.values(monthlyTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-10 mt-4 text-center text-blue-700">
        {`Overtime Record for ${year}
        ${reportType === "billed" ? "(Billed)" : "(Actual)"}`}
      </h2>
      <div className="py-4">
        <DownloadPdfButton
          onClick={() =>
            downloadYearlyOtSummary(billData, dept, year, reportType)
          }
        />
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg border border-blue-200">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-blue-100 text-xs uppercase font-semibold text-blue-600">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Name</th>
              {months.map((month, idx) => (
                <th key={idx} className="px-2 py-2">
                  {month.slice(0, 3)}
                </th>
              ))}
              <th className="px-2 py-2 text-blue-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {billData.map((emp, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                <td className="px-2 py-2 font-bold text-blue-600">{idx + 1}</td>
                <td className="px-2 py-2">{emp.name}</td>
                {months.map((month, i) => (
                  <td key={i} className="px-2 py-2">
                    {Number(emp[month]) || 0}
                  </td>
                ))}
                <td className="px-2 py-2 font-semibold text-blue-700">
                  {round1(getEmployeeTotal(emp))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-200 font-semibold text-blue-800">
            <tr>
              <td className="px-2 py-2 text-center" colSpan={2}>
                Total
              </td>
              {months.map((month, idx) => (
                <td key={idx} className="px-2 py-2">
                  {round1(Number(monthlyTotals[month] ?? 0))}
                </td>
              ))}
              <td className="px-2 py-2">{overallTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default YearView;
