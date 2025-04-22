"use client";
import DownloadPdfButton from "./DownloadPdfButton";
import { formatMonthNameFromRange } from "@/utils/formatMonthName";
import { downloadMonthlyDetailsReport } from "@/utils/pdf-download/downloadMonthlyDetailsReport";
import TextLink from "./TextLink";
import formatDate from "@/utils/formatDate";
import Link from "next/link";

const OtReportMonthly = ({ unitName, groupedData, start, end }) => {
  function getMonthlyTotalOtHour(dateWiseEntries) {
    const total = dateWiseEntries.reduce((sum, entry) => {
      const otHour = parseFloat(entry.totalOtHours);
      return sum + (isNaN(otHour) ? 0 : otHour);
    }, 0);

    return parseFloat(total.toFixed(1)); // round to 1 decimal place
  }

  const grandTotalOt = getMonthlyTotalOtHour(groupedData);

  const monthName = formatMonthNameFromRange(start, end);

  const unitConfig = unitName
    ? {
        unitName,
        start,
        end,
      }
    : null;

  return (
    <>
      <div className="text-2xl font-bold my-2 mt-4 text-center">
        {unitName
          ? `Overtime Log for ${unitName} from ${formatDate(
              start
            )} to ${formatDate(end)}`
          : `Monthly Overtime Details for ${monthName}`}
      </div>
      <div className="my-2">
        <DownloadPdfButton
          onClick={() =>
            downloadMonthlyDetailsReport(groupedData, monthName, unitConfig)
          }
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full  border-gray-200  border-gray-200-gray-300 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">Date</th>
              <th className="border border-gray-200 px-4 py-2">Type</th>
              {unitName ? null : (
                <th className="border border-gray-200 px-4 py-2">Unit</th>
              )}
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
                          <TextLink
                            href={`/overtime/daily?date=${group._id}`}
                            text={group._id}
                          />
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
                        unitName ? null : (
                          <td
                            rowSpan={entry.Employee.length}
                            className="border border-gray-200 px-4 py-2 align-top"
                          >
                            {entry.Unit.map((item, index) => (
                              <TextLink
                                text={
                                  index < entry.Unit.length - 1
                                    ? `${item}, `
                                    : item
                                }
                                key={index}
                                href={`/overtime/unit?start=${start}&end=${end}&name=${item}`}
                              />
                            ))}
                          </td>
                        )
                      ) : null}

                      {/* Work Description */}
                      {empIdx === 0 ? (
                        <td
                          rowSpan={entry.Employee.length}
                          className="border border-gray-200 px-4 py-2 align-top"
                        >
                          <TextLink
                            href={`/overtime/slip?id=${entry._id}`}
                            text={entry.WorkDescription}
                          />
                        </td>
                      ) : null}

                      {/* Employee */}
                      <td className="border border-gray-200 px-4 py-2">
                        <TextLink
                          href={`/overtime/employee?start=${start}&end=${end}&name=${emp.Name}`}
                          text={emp.Name}
                        />
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
                colSpan={unitName ? 5 : 6}
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
    </>
  );
};

export default OtReportMonthly;
