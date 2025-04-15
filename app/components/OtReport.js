import formatDate from "@/utils/formatDate";
import { FileEditIcon } from "lucide-react";
import Link from "next/link";

import DeleteBtnConfirm from "./DeleteBtnConfirm";

const OtReport = ({ reports }) => {
  return (
    <div className="overflow-x-auto shadow-md">
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Sl
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Date
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              OT Type
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Job
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Unit
            </th>
            <th className="px-4 py-2 border border-gray-300" colSpan="3">
              Employees
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Remarks
            </th>
            <th className="px-4 py-2 border border-gray-300" rowSpan="2">
              Actions
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Name</th>
            <th className="px-4 py-2 border border-gray-300">OT Time</th>
            <th className="px-4 py-2 border border-gray-300">OT Hour</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, reportIndex) => {
            const employeeCount = report.Employee.length;
            return report.Employee.map((emp, empIndex) => (
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
                      <Link
                        href={`/overtime/report/daily?date=${report.Date}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {formatDate(report.Date)}
                      </Link>
                    </td>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      {report.Type}
                    </td>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      <Link
                        href={`/overtime/report/view?id=${report._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {report.WorkDescription}
                      </Link>
                    </td>
                    <td
                      className="px-4 py-2 border border-gray-200"
                      rowSpan={employeeCount}
                    >
                      {report.Unit}
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
                {empIndex === 0 && (
                  <td
                    className="px-4 py-2 border border-gray-200"
                    rowSpan={employeeCount}
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/overtime/report/edit?id=${report._id}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FileEditIcon />
                      </Link>
                      <DeleteBtnConfirm currentId={report._id} />
                    </div>
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

export default OtReport;
