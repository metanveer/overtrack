"use client";

import Link from "next/link";
import React from "react";

const otTypeColors = {
  Holiday: "bg-red-100 text-red-700 border-red-300",
  Regular: "bg-blue-100 text-blue-700 border-blue-300",
  Weekend: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Night: "bg-purple-100 text-purple-700 border-purple-300",
  Emergency: "bg-orange-100 text-orange-700 border-orange-300",
  Default: "bg-gray-100 text-gray-700 border-gray-300",
};

const EmployeeOtRecords = ({ data }) => {
  console.log("data", data);

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      {data.map((record, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white shadow-xl border border-gray-200 p-6 space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {record.Employee}
            </h2>
          </div>

          {/* OT Type Summary */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {record.TotalOtHourByType.map((typeItem, idx) => {
              const typeColor =
                otTypeColors[typeItem.Type] || otTypeColors.Default;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 ${typeColor} font-medium shadow-sm`}
                >
                  <p className="text-sm">{typeItem.Type} OT</p>
                  <p className="text-lg">{typeItem.TotalOtHour} hrs</p>
                </div>
              );
            })}
          </div>

          {/* Total OT Full-Width Row */}
          <div className="rounded-xl bg-green-100 text-green-800 border border-green-300 text-center py-4 font-bold text-xl shadow-sm">
            Total Overtime: {record.TotalOtHour} hrs
          </div>

          {/* OT Details Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">OT Hour</th>
                  <th className="px-4 py-2">OT Time</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Work Description</th>
                  <th className="px-4 py-2">Remarks</th>
                  <th className="px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {record.OT.map((entry, i) => {
                  const rowColor =
                    otTypeColors[entry.Type] || otTypeColors.Default;

                  return (
                    <tr
                      key={i}
                      className={`border-t ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* <td className="px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                        <Link href={`/overtime/report/view?id=${entry._id}`}>
                          {entry.Date}
                        </Link>
                      </td> */}
                      <td className="px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                        <Link
                          href={`/overtime/report/view?id=${entry._id}`}
                          className="text-blue-600 hover:underline hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.Date}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{entry.OtHour}</td>
                      <td className="px-4 py-2">{entry.OtTime}</td>
                      <td className="px-4 py-2">{entry.Unit}</td>
                      <td className="px-4 py-2">{entry.WorkDescription}</td>
                      <td className="px-4 py-2">{entry.Remarks}</td>
                      <td
                        className={`px-4 py-2 font-medium border-l ${rowColor}`}
                      >
                        {entry.Type}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeOtRecords;
