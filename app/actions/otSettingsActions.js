"use server";
import { saveOtSettingsToDb } from "@/lib/mongodb/oTSettingsQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import { revalidatePath } from "next/cache";

export async function createOtSettings(prevState, formData) {
  try {
    const authCheck = await checkAuthPermission(perm.SETTINGS_EDIT);

    if (!authCheck.success) {
      return authCheck;
    }

    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const hasEmptyArrays = Object.entries(parsedData).some(
      ([key, value]) => Array.isArray(value) && value.length === 0
    );

    if (hasEmptyArrays) {
      return {
        success: false,
        message: "Each field must contain at least one entry.",
      };
    }

    const hasEmptyValues = (data) => {
      for (const [key, values] of Object.entries(data)) {
        for (const value of values) {
          if (typeof value === "string") {
            if (value.trim() === "") return true;
          } else if (typeof value === "object" && value !== null) {
            for (const field of Object.values(value)) {
              if (String(field).trim() === "") return true;
            }
          }
        }
      }
      return false;
    };

    if (hasEmptyValues(parsedData)) {
      return {
        success: false,
        message: "Please fill all fields or remove empty fields",
      };
    }

    const isFieldUnique = (arr, fieldName = null, label) => {
      const values = arr.map((item) =>
        fieldName
          ? String(item[fieldName]).trim().toLowerCase()
          : String(item).trim().toLowerCase()
      );
      const uniqueValues = new Set(values);
      return {
        isUnique: uniqueValues.size === values.length,
        message: `${label} must be unique.`,
      };
    };

    const checks = [
      { key: "OtType", label: "OT Types" },
      { key: "Unit", label: "Units" },
      { key: "Employee", field: "Name", label: "Employee names" },
      { key: "OtTime", field: "Time", label: "OT Time entries" },
    ];

    for (const { key, field, label } of checks) {
      const { isUnique, message } = isFieldUnique(
        parsedData[key],
        field,
        label
      );
      if (!isUnique) {
        return { success: false, message };
      }
    }

    const trimObjectValues = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map((item) => trimObjectValues(item));
      } else if (typeof obj === "object" && obj !== null) {
        const trimmedObj = {};
        for (const key in obj) {
          trimmedObj[key] = trimObjectValues(obj[key]);
        }
        return trimmedObj;
      } else if (typeof obj === "string") {
        return obj.trim();
      }
      return obj;
    };

    const cleanedData = trimObjectValues(parsedData);

    const { _id } = cleanedData;

    const res = await saveOtSettingsToDb(cleanedData);

    if (res.acknowledged && res.modifiedCount > 0) {
      revalidatePath(`/${_id}/overtime`);
      revalidatePath(`/${_id}/overtime/entry-form`);
      revalidatePath(`/${_id}/overtime/settings/edit`);

      return { success: true, message: "Settings updated successfully!" };
    }
    if (res.acknowledged && res.upsertedCount > 0) {
      revalidatePath(`/${_id}/overtime`);
      revalidatePath(`/${_id}/overtime/entry-form`);
      revalidatePath(`/${_id}/overtime/settings/edit`);

      return { success: true, message: "Settings created successfully" };
    }
    return { success: false, message: "Nothing to save!" };
  } catch (error) {
    console.error("Error saving data:", error);
    return { success: false, message: `Error saving data: ${error.message}` };
  }
}
