"use client";
import { useEffect, useRef, useState } from "react";
import DownloadPdfButton from "./DownloadPdfButton";
import { formatMonthNameFromRange } from "@/utils/formatMonthName";
import { downloadMonthlyDetailsReport } from "@/utils/pdf-download/downloadMonthlyDetailsReport";
import TextLink from "./TextLink";
import formatDate, { getDayName } from "@/utils/formatDate";
import { extractAfterH } from "@/utils/extractAfterH";
import { downloadNotice } from "@/utils/pdf-download/downloadNotice";
import { usePathname, useSearchParams } from "next/navigation";

const OtReportMonthly = ({
  unitName,
  otType,
  groupedData,
  start,
  end,
  dept,
  employeePhones,
}) => {
  const searchParams = useSearchParams();

  const create_notice = searchParams.get("create_notice");

  const isCreatingNotice = create_notice === "true";

  const [printPhoneNumbers, setPrintPhoneNumbers] = useState(true);
  const [printRemarks, setPrintRemarks] = useState(true);

  const [showCheckboxes, setShowCheckboxes] = useState(isCreatingNotice);
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const pathName = usePathname();

  const isNotice = showOnlySelected;
  const hasSelectedDates = selectedDates.size > 0;
  const showHolidayNoticeBtn =
    pathName === `/${dept}/monthly` && !showCheckboxes;
  const inputRef = useRef(null);

  useEffect(() => {
    setShowCheckboxes(isCreatingNotice); // update visibility based on URL param
  }, [isCreatingNotice]);

  // Focus input when it appears
  useEffect(() => {
    if (showOnlySelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showOnlySelected]);

  const toggleCheckboxes = () => {
    setShowCheckboxes((prev) => !prev);
    setSelectedDates(new Set()); // clear previous selection
    setShowOnlySelected(false); // reset any previous filtering
  };

  const toggleDateSelection = (date) => {
    const newSet = new Set(selectedDates);
    if (newSet.has(date)) {
      newSet.delete(date);
    } else {
      newSet.add(date);
    }
    setSelectedDates(newSet);
  };

  const getMonthlyTotalOtHour = (dateWiseEntries) => {
    const total = dateWiseEntries.reduce((sum, entry) => {
      const otHour = parseFloat(entry.totalOtHours);
      return sum + (isNaN(otHour) ? 0 : otHour);
    }, 0);
    return parseFloat(total.toFixed(1));
  };

  const grandTotalOt = getMonthlyTotalOtHour(groupedData);
  const monthName = formatMonthNameFromRange(start, end);

  const pdfConfig = unitName
    ? { unitName, start, end }
    : otType
    ? { otType, start, end }
    : null;

  const visibleData = showOnlySelected
    ? groupedData.filter((group) => selectedDates.has(group._id))
    : groupedData;

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-6">
        <div className="text-2xl font-bold text-center flex-grow">
          {unitName ? (
            `Overtime Log for ${unitName} from ${formatDate(
              start
            )} to ${formatDate(end)}`
          ) : otType ? (
            `${otType} Overtime from ${formatDate(start)} to ${formatDate(end)}`
          ) : showCheckboxes ? (
            isNotice ? (
              <input
                type="text"
                ref={inputRef}
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="Edit notice title"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              "Select Date(s)"
            )
          ) : (
            `Monthly Overtime Details for ${monthName}`
          )}
        </div>
      </div>
      {showOnlySelected && (
        <div className="flex justify-center gap-6 p-4">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors">
            <input
              type="checkbox"
              checked={printPhoneNumbers}
              onChange={(e) => setPrintPhoneNumbers(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            Print Phone Numbers
          </label>

          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-blue-700 transition-colors">
            <input
              type="checkbox"
              checked={printRemarks}
              onChange={(e) => setPrintRemarks(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            Print Remarks
          </label>
        </div>
      )}

      {showHolidayNoticeBtn && (
        <button
          onClick={toggleCheckboxes}
          className="bg-blue-600 font-bold mb-2 text-white rounded-2xl px-6 py-2 hover:bg-blue-700"
        >
          Create Holiday Duty Notice
        </button>
      )}

      <div className="overflow-hidden bg-white rounded-xl border-gray-400 shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-gray-200 table-auto bg-white">
            <thead className="bg-white">
              <tr>
                {showCheckboxes && (
                  <th className="border border-gray-200 px-2 py-2 text-center">
                    Select
                  </th>
                )}
                <th className="border border-gray-200 px-2 py-2">Date</th>
                {otType
                  ? null
                  : !showOnlySelected && (
                      <th className="border border-gray-200 px-2 py-2">Type</th>
                    )}
                {unitName ? null : (
                  <th className="border border-gray-200 px-2 py-2">Unit</th>
                )}
                <th className="border border-gray-200 px-2 py-2">
                  Work Description
                </th>
                <th className="border border-gray-200 px-2 py-2">Employee</th>
                {showOnlySelected && printPhoneNumbers ? (
                  <th className="border border-gray-200 px-2 py-2">
                    Phone No.
                  </th>
                ) : null}

                {!showOnlySelected && (
                  <>
                    <th className="border border-gray-200 px-2 py-2">
                      OT Time
                    </th>
                    <th className="border border-gray-200 px-2 py-2">
                      OT Hour
                    </th>
                  </>
                )}
                {printRemarks && (
                  <th className="border border-gray-200 px-2 py-2">Remarks</th>
                )}
              </tr>
            </thead>

            <tbody>
              {visibleData.map((group) => {
                let dateRowSpan = group.records.reduce(
                  (acc, entry) => acc + entry.Employee.length,
                  0
                );
                let datePrinted = false;

                return group.records.flatMap((entry, entryIdx) =>
                  entry.Employee.map((emp, empIdx) => {
                    const firstRow = !datePrinted;
                    if (firstRow) datePrinted = true;

                    return (
                      <tr
                        key={`${group._id}-${entryIdx}-${empIdx}`}
                        className={`${
                          getDayName(group._id) === "SAT" ||
                          getDayName(group._id) === "FRI"
                            ? `bg-red-100`
                            : ""
                        }`}
                      >
                        {showCheckboxes && firstRow && (
                          <td
                            rowSpan={dateRowSpan}
                            className="border border-gray-200 px-2 py-2 align-top text-center"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDates.has(group._id)}
                              onChange={() => toggleDateSelection(group._id)}
                            />
                          </td>
                        )}

                        {firstRow && (
                          <td
                            rowSpan={dateRowSpan}
                            className="border border-gray-200 px-2 py-2 align-top text-center font-semibold whitespace-nowrap"
                          >
                            <TextLink
                              href={`/${dept}/daily?date=${group._id}`}
                              text={`${formatDate(group._id)} ${getDayName(
                                group._id
                              )}`}
                            />
                          </td>
                        )}

                        {empIdx === 0 && !otType && !showOnlySelected && (
                          <>
                            <td
                              rowSpan={entry.Employee.length}
                              className="border border-gray-200 px-2 py-2 align-top"
                            >
                              {entry.Type}
                            </td>
                          </>
                        )}

                        {empIdx === 0 && !unitName && (
                          <td
                            rowSpan={entry.Employee.length}
                            className="border border-gray-200 px-2 py-2 align-top"
                          >
                            {entry.Unit.map((item, index) => (
                              <TextLink
                                text={
                                  index < entry.Unit.length - 1
                                    ? `${item}, `
                                    : item
                                }
                                key={index}
                                href={`/${dept}/unit?start=${start}&end=${end}&name=${item}`}
                              />
                            ))}
                          </td>
                        )}

                        {empIdx === 0 && (
                          <td
                            rowSpan={entry.Employee.length}
                            className="border border-gray-200 px-2 py-2 align-top"
                          >
                            <TextLink
                              href={`/${dept}/slip?id=${entry._id}`}
                              text={entry.WorkDescription}
                            />
                          </td>
                        )}
                        <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">
                          <TextLink
                            href={`/${dept}/employee?start=${start}&end=${end}&name=${emp.Name}`}
                            text={emp.Name}
                          />
                        </td>
                        {showOnlySelected && printPhoneNumbers && (
                          <td className="border border-gray-200 px-2 py-2 text-sm">
                            {employeePhones?.find((e) => e.Name === emp.Name)
                              ?.Phone || (
                              <span className="text-gray-400 italic">N/A</span>
                            )}
                          </td>
                        )}

                        {!showOnlySelected && (
                          <>
                            <td className="border border-gray-200 px-2 py-2">
                              {extractAfterH(emp.OtTime)}
                            </td>
                            <td className="border border-gray-200 px-2 py-2">
                              {emp.OtHour}
                            </td>
                          </>
                        )}

                        {printRemarks && empIdx === 0 && (
                          <td
                            rowSpan={entry.Employee.length}
                            className="border border-gray-200 px-2 py-2 align-top max-w-3xs"
                          >
                            {entry.Remarks}
                          </td>
                        )}
                      </tr>
                    );
                  })
                );
              })}

              {!showOnlySelected && (
                <tr className="bg-gray-100 font-semibold">
                  <td
                    colSpan={
                      (showCheckboxes ? 1 : 0) + (unitName || otType ? 5 : 6)
                    }
                    className="border border-gray-200 px-2 py-2 text-right"
                  >
                    Total OT Hours
                  </td>
                  <td className="border border-gray-200 px-2 py-2 text-center">
                    {grandTotalOt}
                  </td>
                  <td className="border border-gray-200 px-2 py-2"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showOnlySelected || !showCheckboxes ? (
        <div className="my-2">
          <DownloadPdfButton
            onClick={() => {
              if (isNotice) {
                downloadNotice(
                  visibleData,
                  employeePhones,
                  dept,
                  noticeTitle,
                  printPhoneNumbers,
                  printRemarks
                );
                return;
              }

              downloadMonthlyDetailsReport(
                visibleData,
                monthName,
                pdfConfig,
                dept
              );
            }}
          />
        </div>
      ) : null}

      {showCheckboxes && (
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex gap-3">
            {isNotice ? null : (
              <button
                onClick={() => {
                  setShowOnlySelected(true);
                }}
                className={`px-5 py-2.5 rounded-2xl text-white font-medium transition-all shadow-sm
      ${
        selectedDates.size === 0
          ? "bg-green-300 cursor-not-allowed opacity-60"
          : "bg-green-600 hover:bg-green-700 hover:shadow-md"
      }
    `}
                disabled={!hasSelectedDates}
              >
                Generate
              </button>
            )}

            <button
              onClick={() => {
                setShowCheckboxes(false);
                setSelectedDates(new Set());
                setShowOnlySelected(false);
              }}
              className="px-5 py-2.5 rounded-2xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OtReportMonthly;
