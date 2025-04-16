"use client";
import Link from "next/link";
import React, { useState } from "react";

const SelectDate = () => {
  const [dateSelected, setDateSelected] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  });

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-2xl shadow-md border border-[#eee]">
      <form className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full">
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
          className=" px-12 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition text-center"
        >
          Submit
        </Link>
      </form>
    </div>
  );
};

export default SelectDate;
