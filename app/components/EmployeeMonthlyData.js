"use client";
import { startTransition, useActionState, useState } from "react";
import { createOtSettings } from "../actions/otSettingsActions";
import FormStatus from "./FormStatus";
import createMonthlyHr from "../actions/monthlyHrActions";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function EmployeeMonthlyData({ employeeList }) {
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2023");

  const initEmployeeData = employeeList.map((emp) => ({
    employeeName: emp.Name,
    tripleHr: "",
    billClaimedHr: "",
  }));

  const [employeeData, setEmployeeData] = useState(initEmployeeData);
  const [state, formAction, isPending] = useActionState(createMonthlyHr, {});

  const handleChange = (index, field, value) => {
    const updated = [...employeeData];
    updated[index][field] = value;
    setEmployeeData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const final = {
      month,
      year,
      employeeData,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(final));
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Monthly Employee Hours
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      <div className="space-y-4">
        {employeeData.map((emp, index) => (
          <div key={index} className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="text-md font-semibold text-gray-800 mb-3">
              {emp.employeeName}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Triple Hours
                </label>
                <input
                  type="number"
                  value={emp.tripleHr}
                  onChange={(e) =>
                    handleChange(index, "tripleHr", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Bill Claimed Hours
                </label>
                <input
                  type="number"
                  value={emp.billClaimedHr}
                  onChange={(e) =>
                    handleChange(index, "billClaimedHr", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <pre className="bg-gray-100 p-4 rounded text-sm text-gray-600 overflow-auto">
        {JSON.stringify({ month, year, employeeData }, null, 2)}
      </pre> */}
      {isPending ? (
        "Saving data..."
      ) : state ? (
        <FormStatus state={state} />
      ) : null}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
}
