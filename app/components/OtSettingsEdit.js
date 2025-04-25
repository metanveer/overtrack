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

const OtSettingsEdit = ({ deptName, dataFromDb }) => {
  const emptyData = {
    _id: deptName,
    OtType: [""],
    Unit: [""],
    Employee: [{ Name: "", Designation: "", BasicSalary: "" }],
    OtTime: [{ Time: "", Hour: "" }],
  };

  const initData =
    dataFromDb && Object.keys(dataFromDb).length > 0 ? dataFromDb : emptyData;

  const [data, setData] = useState(initData);
  const [flashingIndex, setFlashingIndex] = useState(null);

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
      router.push(`/${deptName}/overtime/settings`);
    }
  }, [state, router, deptName]);

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

  const handleMove = (key, index, direction) => {
    const newArray = [...data[key]];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newArray.length) return;

    // Swap items
    [newArray[index], newArray[newIndex]] = [
      newArray[newIndex],
      newArray[index],
    ];

    setData({ ...data, [key]: newArray });
    setFlashingIndex(newIndex); // Set the new index to flash

    // Clear the flash after 1 second
    setTimeout(() => setFlashingIndex(null), 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Dropdown Settings
      </h1>

      {/* OT Type Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Overtime Type</h2>
        <div className="space-y-3">
          {data.OtType.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <div className="text-gray-500 font-medium min-w-[1.5rem]">
                {index + 1}.
              </div>
              <div className="flex-1 w-full">
                <input
                  type="text"
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.OtType[index]}
                  placeholder="Overtime Type"
                  onChange={(e) =>
                    handleChange("OtType", index, null, e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete("OtType", index)}
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
            onClick={() => handleAdd("OtType")}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <Plus size={16} /> Add Overtime Type
          </button>
        </div>
      </div>

      {/* Unit Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Unit or Work Location
        </h2>
        <div className="space-y-3">
          {data.Unit.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <div className="text-gray-500 font-medium min-w-[1.5rem]">
                {index + 1}.
              </div>
              <div className="flex-1 w-full">
                <input
                  type="text"
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.Unit[index]}
                  placeholder="Unit"
                  onChange={(e) =>
                    handleChange("Unit", index, null, e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete("Unit", index)}
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
            onClick={() => handleAdd("Unit")}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <Plus size={16} /> Add Unit
          </button>
        </div>
      </div>

      {/* Employee Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Employee</h2>
        <div className="space-y-3">
          {data.Employee.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm transition ${
                index === flashingIndex ? "bg-yellow-100" : ""
              }`}
            >
              <div className="text-gray-500 font-medium min-w-[1.5rem]">
                {index + 1}.
              </div>
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 w-full">
                  <input
                    type="text"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                    value={data.Employee[index].Name}
                    onChange={(e) =>
                      handleChange("Employee", index, "Name", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Designation"
                    value={data.Employee[index].Designation}
                    onChange={(e) =>
                      handleChange(
                        "Employee",
                        index,
                        "Designation",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="text"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Basic Salary"
                    value={data.Employee[index].BasicSalary}
                    onChange={(e) =>
                      handleChange(
                        "Employee",
                        index,
                        "BasicSalary",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs"
                  onClick={() => handleMove("Employee", index, "up")}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs"
                  onClick={() => handleMove("Employee", index, "down")}
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDelete("Employee", index)}
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
            onClick={() => handleAdd("Employee")}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* OT Time Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Overtime Hours</h2>
        <div className="space-y-3">
          {data.OtTime.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <div className="text-gray-500 font-medium min-w-[1.5rem]">
                {index + 1}.
              </div>
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <input
                    type="text"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Time"
                    value={data.OtTime[index].Time}
                    onChange={(e) =>
                      handleChange("OtTime", index, "Time", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hour"
                    value={data.OtTime[index].Hour}
                    onChange={(e) =>
                      handleChange("OtTime", index, "Hour", e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete("OtTime", index)}
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
            onClick={() => handleAdd("OtTime")}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <Plus size={16} /> Add OT Hour
          </button>
        </div>
      </div>

      <FormStatus state={state} />
      {isPending && (
        <p className="text-blue-600 font-medium animate-pulse">
          Saving data...
        </p>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
          disabled={isPending}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default OtSettingsEdit;
