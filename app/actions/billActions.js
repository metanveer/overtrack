"use server";

import {
  getBillByMonth,
  insertBill,
  updateBill,
} from "@/lib/mongodb/billQueries";
import { BILL_COLLECTION } from "@/lib/mongodb/db";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import { revalidatePath } from "next/cache";

export async function createBill(prevData, formData) {
  try {
    const authCheck = await checkAuthPermission(perm.BILLING_CREATE);

    if (!authCheck.success) {
      return authCheck;
    }

    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const { billMonth, billData, dept } = parsedData;

    if (!billMonth || billMonth === "") {
      return { success: false, message: "Bill month is missing!" };
    }
    if (!billData) {
      return { success: false, message: "Bill data is missing!" };
    }
    if (!dept) {
      return { success: false, message: "Dept is missing!" };
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

    const hasDuplicateEntry = await getBillByMonth(billMonth, dept);

    if (hasDuplicateEntry) {
      return {
        success: false,
        message: "Billing for this month already exists!",
      };
    }

    const newBill = await insertBill({ billMonth, billData, dept });

    if (newBill.acknowledged) {
      revalidatePath(`/${dept}`);
      revalidatePath(`/${dept}/billing`);

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
    const authCheck = await checkAuthPermission(perm.BILLING_EDIT);

    if (!authCheck.success) {
      return authCheck;
    }

    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const { billMonth, billData, dept } = parsedData;

    if (!billMonth || billMonth === "") {
      return { success: false, message: "Bill month is missing!" };
    }
    if (!billData) {
      return { success: false, message: "Bill data is missing!" };
    }
    if (!dept) {
      return { success: false, message: "Dept is missing!" };
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

    const updatedBill = await updateBill(billMonth, billData, dept);

    if (updatedBill.modifiedCount > 0) {
      revalidatePath(`/${dept}`);
      revalidatePath(`/${dept}/billing`);

      return { success: true, message: "Data updated successfully" };
    }

    return { success: false, message: "Failed to save or no change made!" };
  } catch (error) {
    console.error("Error updating bill:", error);
    return { success: false, message: `Error updating bill: ${error.message}` };
  }
}

export async function deleteBill(month, dept) {
  try {
    const authCheck = await checkAuthPermission(perm.BILLING_DELETE);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!month) return { success: false, message: "Missing month!" };
    if (!dept) return { success: false, message: "Missing department!" };

    const result = await BILL_COLLECTION.deleteOne({
      billMonth: month,
      dept: dept,
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Document not found!" };
    }
    revalidatePath(`/${dept}`);
    revalidatePath(`/${dept}/billing`);

    return { success: true, message: "Deleted successfully!" };
  } catch (error) {
    console.error("Error deleting report", error);
    return { success: false, message: `Error deleting doc: ${error.message}` };
  }
}
