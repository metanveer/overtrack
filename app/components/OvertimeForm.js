"use client";

import { startTransition, useActionState, useState, useEffect } from "react";
import { createOtEntry, editOtEntry } from "../actions/otActions";
import FormStatus from "./FormStatus";
import getHourFromTimeData from "@/utils/getHourFromTimeData";

import Select from "react-select";
import Link from "next/link";
import { getDayName } from "@/utils/formatDate";

export default function OvertimeForm({
  typeOptions,
  unitOptions,
  nameOptions,
  otTimeOptions,
  isEditing,
  overtimeDoc,
  deptName,
}) {
  const [loading, setLoading] = useState(true); // Loading state for form data
  const emptyData = {
    Date: "",
    Dept: deptName,
    Type: "",
    Unit: [],
    WorkDescription: "",
    Employee: [{ Name: "", OtTime: "", OtHour: "" }],
    Remarks: "",
  };

  const initData = isEditing ? overtimeDoc : emptyData;
  const [formData, setFormData] = useState(initData);

  const actionFn = isEditing ? editOtEntry : createOtEntry;
  const [state, formAction, isPending] = useActionState(actionFn, {});

  useEffect(() => {
    // Simulate loading of options or data (e.g., from an API)
    if (
      !typeOptions.length ||
      !unitOptions.length ||
      !nameOptions.length ||
      !otTimeOptions.length
    ) {
      // Set loading state to true until data is available
      setLoading(true);
    } else {
      setLoading(false); // Data is ready
    }
  }, [typeOptions, unitOptions, nameOptions, otTimeOptions]);

  const isWeekend =
    getDayName(formData.Date) === "SAT" || getDayName(formData.Date) === "FRI";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeSelect = (name, selected) => {
    if (name === "Unit") {
      const selectedValues = selected.map((item) => item.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: selected?.value || "" });
    }
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

    startTransition(() => formAction(formDataToSend));
  };

  const selectStyles = {
    control: () =>
      "border border-gray-300 rounded px-3 py-1 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    multiValue: () => "bg-blue-100 text-blue-700 px-2 py-1 rounded",
    multiValueLabel: () => "text-sm",
    multiValueRemove: () => "text-blue-500 hover:text-blue-700",
    menu: () => "mt-2 rounded border border-gray-200 shadow-lg bg-white z-10",
    option: ({ isFocused, isSelected }) =>
      `px-4 py-2 cursor-pointer rounded ${
        isSelected
          ? "bg-blue-600 text-white"
          : isFocused
          ? "bg-blue-100"
          : "text-gray-900"
      }`,
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  const textareaClass =
    "w-full px-4 py-2 rounded border border-gray-300 shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  // Skeleton Loader styles for full form
  const skeletonClass =
    "bg-gray-200 animate-pulse rounded shadow-sm w-full h-12 mb-4";

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6 border ${
        isWeekend ? "border-red-400 border-2" : "border-gray-200"
      }`}
    >
      {loading ? (
        <div className="space-y-6">
          {/* Skeleton Loader for each section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={skeletonClass} />
            <div className={skeletonClass} />
            <div className={skeletonClass} />
          </div>

          <div>
            <div className={skeletonClass} />
          </div>

          <div>
            <div className={skeletonClass} />
          </div>

          <div>
            <div className={skeletonClass} />
          </div>

          {/* Skeleton Loader for the submit button */}
          <div className="text-right">
            <div className={skeletonClass} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Date {formData.Date ? `(${getDayName(formData.Date)})` : ""}
              </label>
              <input
                type="date"
                id="Date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                inputId="OtType"
                classNames={selectStyles}
                value={
                  formData.Type
                    ? { label: formData.Type, value: formData.Type }
                    : null
                }
                onChange={(selected) => handleChangeSelect("Type", selected)}
                options={typeOptions.map((type) => ({
                  label: type,
                  value: type,
                }))}
                placeholder="Select Type"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Unit
              </label>
              <Select
                inputId="Unit"
                isMulti
                classNames={selectStyles}
                value={formData.Unit.map((unit) => ({
                  label: unit,
                  value: unit,
                }))}
                onChange={(selected) => handleChangeSelect("Unit", selected)}
                options={unitOptions.map((unit) => ({
                  label: unit,
                  value: unit,
                }))}
                placeholder="Select Unit(s)"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Work Description
            </label>
            <textarea
              id="WorkDescription"
              name="WorkDescription"
              value={formData.WorkDescription}
              onChange={handleChange}
              className={textareaClass}
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Employees
            </label>
            <div className="space-y-4">
              {formData.Employee.map((emp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
                >
                  <Select
                    inputId={`Employee-${idx}`}
                    className="w-full sm:flex-1"
                    classNames={selectStyles}
                    value={
                      emp.Name ? { label: emp.Name, value: emp.Name } : null
                    }
                    onChange={(selected) =>
                      handleEmployeeChange(idx, "Name", selected?.value || "")
                    }
                    options={nameOptions.map((name) => ({
                      label: name.Name,
                      value: name.Name,
                    }))}
                    placeholder="Select Name"
                  />

                  <Select
                    className="w-full sm:flex-1"
                    classNames={selectStyles}
                    inputId={`OtTime-${idx}`}
                    value={
                      emp.OtTime
                        ? { label: emp.OtTime, value: emp.OtTime }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleEmployeeChange(
                        idx,
                        "OtTime",
                        selectedOption?.value || ""
                      )
                    }
                    options={otTimeOptions.map((time) => ({
                      label: time.Time,
                      value: time.Time,
                    }))}
                    placeholder="Select OT Time"
                  />

                  <input
                    type="text"
                    value={emp.OtHour || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{1,3}(\.\d{0,2})?$/.test(value)) {
                        handleEmployeeChange(idx, "OtHour", value);
                      }
                    }}
                    readOnly={emp.OtTime !== "Special"}
                    disabled={emp.OtTime !== "Special"}
                    className={`${inputClass} ${
                      emp.OtTime === "Special" ? "" : "bg-gray-100"
                    } text-center sm:flex-1`}
                  />

                  <button
                    type="button"
                    onClick={() => removeEmployee(idx)}
                    className="text-red-600 text-lg font-bold hover:text-red-800 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              id="add-employee-btn"
              onClick={addEmployee}
              className="mt-3 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              + Add Employee
            </button>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              id="Remarks"
              name="Remarks"
              value={formData.Remarks}
              onChange={handleChange}
              className={textareaClass}
              rows="2"
            />
          </div>

          {isPending ? "Submitting..." : null}

          <div className="flex gap-6 justify-between">
            <Link
              href={
                isEditing
                  ? `/${deptName}/overtime/slip?id=${overtimeDoc._id}`
                  : `/${deptName}/overtime`
              }
              className="mt-6 inline-block px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
            >
              Close Editor
            </Link>

            <button
              type="submit"
              className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isEditing ? "Update Overtime" : "Submit Overtime"}
            </button>
          </div>

          <FormStatus state={state} />
        </>
      )}
    </form>
  );
}
