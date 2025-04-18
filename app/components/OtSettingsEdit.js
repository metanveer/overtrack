"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { Plus, Trash2 } from "lucide-react";
import { createOtSettings } from "@/app/actions/otSettingsActions";
import FormStatus from "@/app/components/FormStatus";
import { useRouter } from "next/navigation";

const OtSettingsEdit = ({ dataFromDb }) => {
  const emptyData = {
    OtType: [""],
    Unit: [""],
    Employee: [{ Name: "", Designation: "", BasicSalary: "" }],
    OtTime: [{ Time: "", Hour: "" }],
  };

  const initData = dataFromDb ? dataFromDb : emptyData;

  const [data, setData] = useState(initData);

  const [state, formAction, isPending] = useActionState(createOtSettings, {});
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state && state.success) {
      router.push("/overtime/settings");
    }
  }, [state, router]);

  const handleChange = (key, index, field, value) => {
    const newArray = [...data[key]];

    // Sanitize and validate the Hour field inside OtTime
    if (key === "OtTime" && field === "Hour") {
      const trimmed = value.trim();
      const isValid = /^(\d+(\.\d{0,1})?)?$/.test(trimmed); // allows numbers or one decimal place

      if (!isValid) return; // don't update if input is invalid

      newArray[index] = {
        ...newArray[index],
        [field]: trimmed, // store as trimmed string
      };
    } else if (typeof newArray[index] === "object") {
      newArray[index] = {
        ...newArray[index],
        [field]: value,
      };
    } else {
      newArray[index] = value;
    }

    setData({ ...data, [key]: newArray });
  };

  const handleDelete = (key, index) => {
    const newArray = [...data[key]];
    newArray.splice(index, 1);
    setData({ ...data, [key]: newArray });
  };

  const handleAdd = (key) => {
    let newItem;
    if (key === "Employee")
      newItem = { Name: "", Designation: "", BasicSalary: "" };
    else if (key === "Unit") newItem = "";
    else if (key === "OtType") newItem = "";
    else if (key === "OtTime") newItem = { Time: "", Hour: "" };
    else newItem = "";

    setData({ ...data, [key]: [...data[key], newItem] });
  };

  const getLabel = (key) => {
    if (key === "OtType") return "OT Type";
    if (key === "OtTime") return "OT Time";
    return key;
  };

  const getPlaceholder = (keyOrField) => {
    if (keyOrField === "OtType") return "OT Type";
    if (keyOrField === "BasicSalary") return "Basic Salary";
    if (keyOrField === "OtTime") return "OT Time";
    return keyOrField;
  };

  const renderInput = (key, item, index) => {
    if (typeof item === "object") {
      const fields = Object.keys(item);
      const isEmployee = key === "Employee";

      return (
        <div
          className={
            isEmployee
              ? "grid grid-cols-1 sm:flex sm:items-center gap-2 w-full"
              : "grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
          }
        >
          {fields.map((field) => (
            <input
              key={field}
              type={field === "Hour" ? "text" : "text"}
              inputMode={field === "Hour" ? "decimal" : "text"}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={data[key][index][field] || ""}
              placeholder={getPlaceholder(field)}
              onChange={(e) => handleChange(key, index, field, e.target.value)}
            />
          ))}
        </div>
      );
    } else {
      return (
        <input
          type="text"
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={item || ""}
          placeholder={getPlaceholder(key)}
          onChange={(e) => handleChange(key, index, null, e.target.value)}
        />
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Dropdown Settings
      </h1>

      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-4">
          <h2 className="text-xl font-semibold capitalize text-gray-700">
            {getLabel(key)}
          </h2>

          <div className="space-y-3">
            {value.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <div className="text-gray-500 font-medium min-w-[1.5rem]">
                  {index + 1}.
                </div>
                <div className="flex-1 w-full">
                  {renderInput(key, item, index)}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(key, index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleAdd(key)}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
            >
              <Plus size={16} /> Add {getLabel(key)}
            </button>
          </div>
        </div>
      ))}

      <FormStatus state={state} />
      {isPending && (
        <p className="text-blue-600 font-medium animate-pulse">
          Saving data...
        </p>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default OtSettingsEdit;
