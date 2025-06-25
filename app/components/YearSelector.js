"use client";
import Link from "next/link";
import React, { useState } from "react";

const YearSelector = ({ dept, initYear }) => {
  const currentDate = new Date();

  const year = initYear || currentDate.getFullYear();

  const [selectedYear, setSelectedYear] = useState(year);

  const yearSelected = `${selectedYear}`;

  return (
    <div className="p-6 sm:p-8 lg:pb-2 max-w-3xl mx-auto  bg-white rounded-2xl shadow-md border border-[#ddd]">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 text-center">
        Year
      </h1>
      <form className="flex flex-col lg:flex-row gap-4 items-center justify-between ">
        <div className="lg:flex w-full gap-4">
          <div className="w-full my-3">
            <input
              type="number"
              id="year"
              name="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold"
              min="2000"
              max="2100"
              required
            />
          </div>
        </div>
        <div className="w-full flex gap-4">
          <Link
            href={`/${dept}/overtime/yearly?year=${yearSelected}`}
            className="w-full text-center px-6 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Actual Hrs
          </Link>
          <Link
            href={`/${dept}/overtime/yearly?year=${yearSelected}&type=billed`}
            className="w-full text-center px-6 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Billed Hrs
          </Link>
        </div>
      </form>
    </div>
  );
};

export default YearSelector;
