"use client";

import { startTransition, useActionState, useState } from "react";
import { createOtEntry, editOtEntry } from "../actions/otActions";
import FormStatus from "./FormStatus";
import getHourFromTimeData from "@/utils/getHourFromTimeData";

export default function OvertimeForm({
  typeOptions,
  unitOptions,
  nameOptions,
  otTimeOptions,
  isEditing,
  overtimeDoc,
}) {
  const emptyData = {
    Date: "",
    Type: "",
    Unit: "",
    WorkDescription: "",
    Employee: [{ Name: "", OtTime: "", OtHour: "" }],
    Remarks: "",
  };

  const initData = isEditing ? overtimeDoc : emptyData;

  const [formData, setFormData] = useState(initData);

  const actionFn = isEditing ? editOtEntry : createOtEntry;

  const [state, formAction, isPending] = useActionState(actionFn, {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...formData.Employee];
    updatedEmployees[index][field] = value;

    if (field === "OtTime") {
      updatedEmployees[index]["OtHour"] = getHourFromTimeData(
        value,
        otTimeOptions
      );
    }

    setFormData({ ...formData, Employee: updatedEmployees });
  };

  const addEmployee = () => {
    const firstOtTime = formData.Employee[0]?.OtTime || "";
    setFormData({
      ...formData,
      Employee: [
        ...formData.Employee,
        {
          Name: "",
          OtTime: firstOtTime,
          OtHour: getHourFromTimeData(firstOtTime, otTimeOptions),
        },
      ],
    });
  };

  const removeEmployee = (index) => {
    if (formData.Employee.length === 1) return;
    const updatedEmployees = [...formData.Employee];
    updatedEmployees.splice(index, 1);
    setFormData({ ...formData, Employee: updatedEmployees });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));

    startTransition(() => {
      formAction(formDataToSend);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6 border border-[#eee]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2"
            required
          >
            <option value="">Select Type</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Unit</label>
          <select
            name="Unit"
            value={formData.Unit}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2"
            required
          >
            <option value="">Select Unit</option>
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Work Description</label>
        <textarea
          name="WorkDescription"
          value={formData.WorkDescription}
          onChange={handleChange}
          className="w-full border rounded-xl px-3 py-2"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Employees</label>
        <div className="space-y-4">
          {formData.Employee.map((emp, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
              <select
                value={emp.Name}
                onChange={(e) =>
                  handleEmployeeChange(idx, "Name", e.target.value)
                }
                className="w-full sm:flex-1 border rounded-xl px-3 py-2"
                required
              >
                <option value="">Select Name</option>
                {nameOptions.map((name) => (
                  <option key={name.Name} value={name.Name}>
                    {name.Name}
                  </option>
                ))}
              </select>

              <select
                value={emp.OtTime}
                onChange={(e) => {
                  handleEmployeeChange(idx, "OtTime", e.target.value);
                  // Update OtHour when OtTime changes
                  handleEmployeeChange(
                    idx,
                    "OtHour",
                    getHourFromTimeData(e.target.value, otTimeOptions)
                  );
                }}
                className="w-full sm:flex-1 border rounded-xl px-3 py-2"
                required
              >
                <option value="">Select OT Time</option>
                {otTimeOptions.map((time) => (
                  <option key={time.Time} value={time.Time}>
                    {time.Time}
                  </option>
                ))}
              </select>

              {/* Readonly field to display OtHour */}
              <input
                type="text"
                value={emp.OtHour}
                readOnly
                disabled
                className="w-full sm:flex-1 border rounded-xl px-3 py-2 bg-gray-100"
              />

              <button
                type="button"
                onClick={() => removeEmployee(idx)}
                className="text-red-600 font-bold hover:text-red-800 transition sm:self-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addEmployee}
          className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition"
        >
          + Add Employee
        </button>
      </div>

      <div>
        <label className="block font-semibold mb-1">Remarks</label>
        <textarea
          name="Remarks"
          value={formData.Remarks}
          onChange={handleChange}
          className="w-full border rounded-xl px-3 py-2"
          rows="2"
        />
      </div>

      {/* <pre className="bg-gray-100 p-4 rounded text-sm text-gray-600 overflow-auto">
        {JSON.stringify(formData, null, 2)}
      </pre> */}

      {isPending ? (
        "Saving data..."
      ) : state ? (
        <FormStatus state={state} />
      ) : null}

      <div className="text-right">
        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
