import React from "react";

const OtReportDaily = ({ records }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Sl
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Job
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Unit
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              OT Type
            </th>
            <th className="px-4 py-2 border border-gray-300" colSpan="3">
              Employees
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Remarks
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Name</th>
            <th className="px-4 py-2 border border-gray-300">OT Time</th>
            <th className="px-4 py-2 border border-gray-300">OT Hour</th>
          </tr>
        </thead>
        <tbody>
          {records.map((report, reportIndex) => {
            const employeeCount = report.Employees.length;
            return report.Employees.map((emp, empIndex) => (
              <tr key={`${reportIndex}-${empIndex}`} className="border-t">
                {empIndex === 0 && (
                  <>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      {reportIndex + 1}
                    </td>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      {report.WorkDescription}
                    </td>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      {report.Unit}
                    </td>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      {report.Type}
                    </td>
                  </>
                )}
                <td className="px-4 py-2 border border-gray-200">{emp.Name}</td>
                <td className="px-4 py-2 border border-gray-200">
                  {emp.OtTime}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {emp?.OtHour}
                </td>

                {empIndex === 0 && (
                  <td
                    className="px-4 py-2 border border-gray-200"
                    rowSpan={employeeCount}
                  >
                    {report.Remarks}
                  </td>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OtReportDaily;
