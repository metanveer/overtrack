"use client";
import DownloadPdfButton from "./DownloadPdfButton";
import formatMonthName from "@/utils/formatMonthName";
import { downloadMonthlyDetailsReport } from "@/utils/pdf-download/downloadMonthlyDetailsReport";

const OtReportMonthly = ({ groupedData, monthString }) => {
  const grandTotalOt = groupedData.reduce((total, group) => {
    return (
      total +
      group.records.reduce((recordTotal, record) => {
        return (
          recordTotal +
          record.Employee.reduce(
            (empTotal, emp) => empTotal + parseFloat(emp.OtHour),
            0
          )
        );
      }, 0)
    );
  }, 0);

  const monthName = formatMonthName(monthString);

  return (
    <div className="overflow-x-auto">
      <div className="mb-3">
        <DownloadPdfButton
          onClick={() => downloadMonthlyDetailsReport(groupedData, monthName)}
        />
      </div>
      <div className="text-2xl font-bold my-3 text-center">
        Monthly OT Details for {monthName}
      </div>

      <table className="min-w-full  border-gray-200  border-gray-200-gray-300 table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 px-4 py-2">Date</th>
            <th className="border border-gray-200 px-4 py-2">Type</th>
            <th className="border border-gray-200 px-4 py-2">Unit</th>
            <th className="border border-gray-200 px-4 py-2">
              Work Description
            </th>
            <th className="border border-gray-200 px-4 py-2">Employee</th>
            <th className="border border-gray-200 px-4 py-2">OT Time</th>
            <th className="border border-gray-200 px-4 py-2">OT Hour</th>
            <th className="border border-gray-200 px-4 py-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((group) => {
            let dateRowSpan = group.records.reduce(
              (acc, entry) => acc + entry.Employee.length,
              0
            );

            let datePrinted = false;

            return group.records.map((entry, entryIdx) => {
              return entry.Employee.map((emp, empIdx) => {
                return (
                  <tr key={`${group._id}-${entryIdx}-${empIdx}`}>
                    {/* Date */}
                    {!datePrinted && (
                      <td
                        rowSpan={dateRowSpan}
                        className="border border-gray-200 px-4 py-2 align-top text-center bg-gray-50 font-semibold"
                      >
                        {group._id}
                      </td>
                    )}
                    {(() => {
                      if (!datePrinted) datePrinted = true;
                    })()}

                    {/* Type */}
                    {empIdx === 0 ? (
                      <td
                        rowSpan={entry.Employee.length}
                        className="border border-gray-200 px-4 py-2 align-top"
                      >
                        {entry.Type}
                      </td>
                    ) : null}

                    {/* Unit */}
                    {empIdx === 0 ? (
                      <td
                        rowSpan={entry.Employee.length}
                        className="border border-gray-200 px-4 py-2 align-top"
                      >
                        {entry.Unit}
                      </td>
                    ) : null}

                    {/* Work Description */}
                    {empIdx === 0 ? (
                      <td
                        rowSpan={entry.Employee.length}
                        className="border border-gray-200 px-4 py-2 align-top"
                      >
                        {entry.WorkDescription}
                      </td>
                    ) : null}

                    {/* Employee */}
                    <td className="border border-gray-200 px-4 py-2">
                      {emp.Name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {emp.OtTime}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {emp.OtHour}
                    </td>

                    {/* Remarks */}
                    {empIdx === 0 ? (
                      <td
                        rowSpan={entry.Employee.length}
                        className="border border-gray-200 px-4 py-2 align-top"
                      >
                        {entry.Remarks}
                      </td>
                    ) : null}
                  </tr>
                );
              });
            });
          })}

          {/* Final row for grand total */}
          <tr className="bg-gray-100 font-semibold">
            <td
              colSpan={6}
              className="border border-gray-200 px-4 py-2 text-right"
            >
              Total OT Hours
            </td>
            <td className="border border-gray-200 px-4 py-2 text-center">
              {grandTotalOt}
            </td>
            <td className="border border-gray-200 px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OtReportMonthly;

// const groupedData = [
//   {
//     _id: "2025-04-10",
//     records: [
//       {
//         Type: "Regular",
//         Unit: "Topping",
//         WorkDescription: "Topping startup",
//         Employee: [
//           { Name: "MR. MD. ABU NAYEEM", OtTime: "08.00-16.00", OtHour: "8" },
//           {
//             Name: "MR. MD. ABDUL MOMEN",
//             OtTime: "17.00-22.00 & 12.00-14.00",
//             OtHour: "10",
//           },
//         ],
//         Remarks: "Test",
//       },
//       {
//         Type: "Regular",
//         Unit: "Reforming",
//         WorkDescription: "Reforming startup",
//         Employee: [
//           { Name: "MR. MD. ABU TAHER", OtTime: "17.00-08.00", OtHour: "15" },
//           {
//             Name: "MR. MD. SARWAR JAHAN",
//             OtTime: "17.00-08.00",
//             OtHour: "15",
//           },
//         ],
//         Remarks: "Test",
//       },
//       {
//         Type: "Weekend",
//         Unit: "Merox-III",
//         WorkDescription: "Error eum animi ame",
//         Employee: [
//           {
//             Name: "MR. MD. ABU NAYEEM",
//             OtTime: "08.00-02.00 & 12.00-14.00",
//             OtHour: "23",
//           },
//         ],
//         Remarks: "Quisquam sint odit",
//       },
//       {
//         Type: "Weekend",
//         Unit: "Merox-II",
//         WorkDescription: "Atque lorem ipsa et",
//         Employee: [
//           {
//             Name: "MR. MD. ABU NAYEEM",
//             OtTime: "14.50-06.00",
//             OtHour: "15.166667",
//           },
//           {
//             Name: "MR. S M KAMRUL HASAN",
//             OtTime: "14.50-06.00",
//             OtHour: "15.166667",
//           },
//           {
//             Name: "MR. MD. ABU TAHER",
//             OtTime: "14.50-06.00",
//             OtHour: "15.166667",
//           },
//           {
//             Name: "MR. MD. ABDUL MOMEN",
//             OtTime: "14.50-06.00",
//             OtHour: "15.166667",
//           },
//         ],
//         Remarks: "Odio quos aute nostr",
//       },
//     ],
//   },
//   {...}
// ];
