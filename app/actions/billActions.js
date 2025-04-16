"use server";

import {
  getBillByMonth,
  insertBill,
  updateBill,
} from "@/lib/mongodb/billQueries";
import { BILL_COLLECTION } from "@/lib/mongodb/db";
import { revalidatePath } from "next/cache";

export async function createBill(prevData, formData) {
  try {
    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const { billMonth, billData } = parsedData;

    if (!billMonth || billMonth === "") {
      return { success: false, message: "Bill month is missing!" };
    }
    if (!billData) {
      return { success: false, message: "Bill data is missing!" };
    }
    if (billData.length === 0) {
      return { success: false, message: "No bill data was provided!" };
    }

    function hasMissingBillOrTriple(billData) {
      return billData.some((item) => item.bill === "" || item.triple === "");
    }

    if (hasMissingBillOrTriple(billData)) {
      return {
        success: false,
        message: "Please fill up all bill and triple input fields",
      };
    }

    const hasDuplicateEntry = await getBillByMonth(billMonth);

    if (hasDuplicateEntry) {
      return {
        success: false,
        message: "Billing for this month already exists!",
      };
    }

    const newBill = await insertBill({ billMonth, billData });

    if (newBill.acknowledged) {
      revalidatePath("/overtime/report/billing");
      revalidatePath("/overtime/report/billing");

      return { success: true, message: "Bill data saved successfully." };
    }
    return { success: false, message: "Failed to save bill data." };
  } catch (error) {
    console.error("Error creating bill:", error);
    return { success: false, message: `Error creating bill: ${error.message}` };
  }
}
export async function editBill(prevData, formData) {
  try {
    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const { billMonth, billData } = parsedData;

    if (!billMonth || billMonth === "") {
      return { success: false, message: "Bill month is missing!" };
    }
    if (!billData) {
      return { success: false, message: "Bill data is missing!" };
    }
    if (billData.length === 0) {
      return { success: false, message: "No bill data was provided!" };
    }

    function hasMissingBillOrTriple(data) {
      return data.some((item) => item.bill === "" || item.triple === "");
    }

    if (hasMissingBillOrTriple(billData)) {
      return {
        success: false,
        message: "Please fill up all bill and triple input fields",
      };
    }

    const updatedBill = await updateBill(billMonth, billData);

    if (updatedBill.modifiedCount > 0) {
      revalidatePath("/overtime/report/billing");
      revalidatePath("/overtime/report/billing");

      return { success: true, message: "Data updated successfully" };
    }

    return { success: false, message: "Failed to save or no change made!" };
  } catch (error) {
    console.error("Error updating bill:", error);
    return { success: false, message: `Error updating bill: ${error.message}` };
  }
}

export async function deleteBill(month) {
  try {
    if (!month) return { success: false, message: "Missing month!" };

    const result = await BILL_COLLECTION.deleteOne({
      billMonth: month,
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Document not found!" };
    }
    revalidatePath(`/overtime/report/billing`);

    return { success: true, message: "Deleted successfully!" };
  } catch (error) {
    console.error("Error deleting report", error);
    return { success: false, message: `Error deleting doc: ${error.message}` };
  }
}
