"use client";
import Link from "next/link";
import React, { useState } from "react";

const BillingMonthSelector = ({ initMonth }) => {
  const currentDate = new Date();
  // const [selectedMonth, setSelectedMonth] = useState(
  //   String(currentDate.getMonth() + 1).padStart(2, "0")
  // );
  // const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const year = initMonth?.split("-")[0] || currentDate.getFullYear();
  const month = initMonth?.split("-")[1] || String(currentDate.getMonth() + 1).padStart(2, "0");



  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

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

  const monthSelected = `${selectedYear}-${selectedMonth}`;

  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-5xl mx-auto  bg-white rounded-2xl shadow-md border border-[#ddd]">

      <form className="flex flex-col lg:flex-row gap-4 items-center justify-between ">
        <div className="lg:flex w-full gap-4">
          <div className="w-full my-3">
            <select
              id="month"
              name="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full my-3">
            <input
              type="number"
              id="year"
              name="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="2000"
              max="2100"
              required
            />
          </div>
        </div>
        <div className="lg:w-fit md:w-full sm:w-full whitespace-nowrap flex gap-4">
          <Link
            href={`/overtime/report/billing?month=${monthSelected}`}
            className="w-full text-center px-12 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Get Bill
          </Link>

        </div>
      </form>
    </div>
  );
};

export default BillingMonthSelector;
