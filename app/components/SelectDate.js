"use client";
import Link from "next/link";
import React, { useState } from "react";

const SelectDate = () => {
  const [dateSelected, setDateSelected] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  });

  return (
    <div className="p-4 max-w-md mx-auto mt-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Please Choose a Date
      </h1>
      <form className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            name="Date"
            id="date"
            value={dateSelected}
            onChange={(e) => setDateSelected(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <Link
          href={`/overtime/report/daily?date=${dateSelected}`}
          className="w-full px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition text-center"
        >
          Submit
        </Link>
      </form>
    </div>
  );
};

export default SelectDate;
