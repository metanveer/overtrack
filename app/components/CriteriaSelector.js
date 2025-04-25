"use client";
import Link from "next/link";
import React, { useState } from "react";

const CriteriaSelector = ({
  employeeOptions = [],
  start,
  end,
  name,
  isUnit,
  dept,
}) => {
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentYear = currentDate.getFullYear();

  function getInitMode() {
    if (start && end && name) {
      return "range";
    }
    return "month";
  }

  const [mode, setMode] = useState(getInitMode()); // "month" or "range"
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(start || "");
  const [endDate, setEndDate] = useState(end || "");
  const [employeeName, setEmployeeName] = useState(name || "");

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const isMonthFormValid = selectedMonth && selectedYear && employeeName;
  const isRangeFormValid = startDate && endDate && employeeName;

  const getLink = () => {
    if (mode === "month" && isMonthFormValid) {
      const start = `${selectedYear}-${selectedMonth}-01`;
      const endDateObj = new Date(selectedYear, parseInt(selectedMonth), 0); // last day of the month
      const end = `${selectedYear}-${selectedMonth}-${String(
        endDateObj.getDate()
      ).padStart(2, "0")}`;

      return `/${dept}/overtime/${
        isUnit ? "unit" : "employee"
      }?start=${start}&end=${end}&name=${employeeName}`;
    }

    if (mode === "range" && isRangeFormValid) {
      return `/${dept}/overtime/${
        isUnit ? "unit" : "employee"
      }?start=${startDate}&end=${endDate}&name=${employeeName}`;
    }

    return "#";
  };

  return (
    <div
      className="p-4 max-w-5xl mx-auto mt-6 bg-white rounded-2xl shadow-md border border-[#ddd]
"
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Select {mode === "month" ? "Month" : "Date Range"}
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setMode("month")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            mode === "month"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Month & Year
        </button>
        <button
          type="button"
          onClick={() => setMode("range")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            mode === "range"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Date Range
        </button>
      </div>

      <form className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6 md:items-end md:justify-between">
        {mode === "month" && (
          <>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2000"
                max="2100"
              />
            </div>
          </>
        )}

        {mode === "range" && (
          <>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isUnit ? "Unit Name" : "Employee Name"}
          </label>
          <select
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {isUnit ? "Select unit" : "Select employee"}
            </option>
            {employeeOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Link
            href={getLink()}
            className={`block w-full px-6 py-3 rounded-xl font-semibold text-center transition ${
              (mode === "month" && isMonthFormValid) ||
              (mode === "range" && isRangeFormValid)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 pointer-events-none"
            }`}
          >
            Submit
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CriteriaSelector;
