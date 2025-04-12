"use server";

import {
  getMonthlyHr,
  insertMonthlyHr,
} from "@/lib/mongodb/monthlyHourQueries";

export default async function createMonthlyHr(prevData, formData) {
  try {
    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
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

    const { month, year } = parsedData;

    if (!month || !year) {
      return { success: false, message: "Month and year are required." };
    }

    const existingData = await getMonthlyHr({ month, year });
    if (existingData) {
      return {
        success: false,
        message: `Data for ${month} ${year} already exists.`,
      };
    }

    const newData = await insertMonthlyHr(parsedData);

    if (newData.acknowledged) {
      return { success: true, message: "Data saved successfully." };
    }

    return { success: false, message: "Failed to save!" };
  } catch (error) {
    console.error("Error creating OT entry:", error);
    return { success: false, message: `Error adding OT: ${error.message}` };
  }
}
