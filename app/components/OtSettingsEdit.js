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
    if (typeof newArray[index] === "object") {
      newArray[index] = { ...newArray[index], [field]: value };
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
    if (key === "OtType") return "Add OT Types";
    if (key === "OtTime") return "Define OT Times";
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
              type="text"
              className="border p-2 rounded w-full"
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
          className="border p-2 rounded w-full"
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
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow"
    >
      <h1 className="text-2xl font-semibold text-gray-800">
        Dropdown Settings
      </h1>

      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold capitalize text-gray-700">
              {getLabel(key)}
            </h2>
            <button
              type="button"
              onClick={() => handleAdd(key)}
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {value.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
              >
                {renderInput(key, item, index)}
                <button
                  type="button"
                  onClick={() => handleDelete(key, index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* <pre className="bg-gray-100 p-4 rounded text-sm text-gray-600 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre> */}
      {isPending ? "Saving data..." : <FormStatus state={state} />}
      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default OtSettingsEdit;
