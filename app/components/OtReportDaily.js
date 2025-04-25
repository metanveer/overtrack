"use client";

import DownloadPdfButton from "./DownloadPdfButton";
import { downloadDailyReport } from "@/utils/pdf-download/downloadDailyReport";
import TextLink from "./TextLink";
import round1 from "@/utils/round1";

const calculateTotalOtHours = (data) => {
  return data.reduce((sum, item) => {
    const employeeHours = item.Employees.reduce((empSum, emp) => {
      return empSum + Number(emp.OtHour);
    }, 0);
    return sum + employeeHours;
  }, 0);
};

const OtReportDaily = ({ records, date, dept }) => {
  const totalOtHours = calculateTotalOtHours(records);

  return (
    <div>
      <div className="mb-6">
        <DownloadPdfButton onClick={() => downloadDailyReport(records, date)} />
      </div>
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
                        <TextLink
                          href={`/${dept}/overtime/slip?id=${report._id}`}
                          text={report.WorkDescription}
                        />
                      </td>
                      <td
                        className="px-4 py-2 border border-gray-200"
                        rowSpan={employeeCount}
                      >
                        {report.Unit.join(", ")}
                      </td>
                      <td
                        className="px-4 py-2 border border-gray-200"
                        rowSpan={employeeCount}
                      >
                        {report.Type}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-2 border border-gray-200">
                    <TextLink
                      text={emp.Name}
                      href={`/${dept}/overtime/employee?start=${date}&end=${date}&name=${emp.Name}`}
                    />
                  </td>
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

            <tr className="bg-gray-100 font-semibold">
              <td
                className="px-4 py-2 border border-gray-300 text-right"
                colSpan={6}
              >
                Total OT Hours
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {round1(totalOtHours)}
              </td>
              <td className="px-4 py-2 border border-gray-300"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtReportDaily;
