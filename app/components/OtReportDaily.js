import React from "react";

const calculateTotalOtHours = (data) => {
  return data.reduce((sum, item) => {
    const employeeHours = item.Employees.reduce((empSum, emp) => {
      return empSum + Number(emp.OtHour);
    }, 0);
    return sum + employeeHours;
  }, 0);
};

const OtReportDaily = ({ records }) => {
  const totalOtHours = calculateTotalOtHours(records);

  return (
    <div className="overflow-x-auto">
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
                  {emp.OtHour}
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

          {/* Total Row */}
          <tr className="bg-gray-100 font-semibold">
            <td
              className="px-4 py-2 border border-gray-300 text-right"
              colSpan={6}
            >
              Total OT Hours
            </td>
            <td className="px-4 py-2 border border-gray-300">{totalOtHours}</td>
            <td className="px-4 py-2 border border-gray-300"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OtReportDaily;
