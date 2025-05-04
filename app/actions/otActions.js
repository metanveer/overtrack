"use server";

import { OVERTIME_COLLECTION } from "@/lib/mongodb/db";
import {
  checkDuplicateOtEntry,
  insertOt,
  updateOtById,
} from "@/lib/mongodb/otQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function createOtEntry(prevData, formData) {
  try {
    const authCheck = await checkAuthPermission(perm.OT_ADD);

    if (!authCheck.success) {
      return authCheck;
    }

    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const { Date, Type, Unit, WorkDescription, Employee, Remarks, Dept } =
      parsedData;
    if (!Date || !Type || !Unit || !WorkDescription || !Employee || !Dept) {
      return { success: false, message: "All fields are required." };
    }

    const hasEmptyValues = Employee.some((emp) =>
      Object.values(emp).some((value) => value.trim() === "")
    );

    if (hasEmptyValues) {
      return { success: false, message: "Please fill up Employees section." };
    }

    const hasDuplicateEntry = await checkDuplicateOtEntry(parsedData);

    if (hasDuplicateEntry) {
      return { success: false, message: "Already added!" };
    }

    const newOtEntry = await insertOt(parsedData);

    if (newOtEntry.acknowledged) {
      revalidatePath(`/${Dept}`);
      revalidatePath(`/${Dept}/overtime`);
      revalidatePath(`/${Dept}/overtime/daily`);
      revalidatePath(`/${Dept}/overtime/monthly`);

      return { success: true, message: "OT entry saved successfully." };
    }
    return { success: false, message: "Failed to create OT." };
  } catch (error) {
    console.error("Error creating OT entry:", error);
    return { success: false, message: `Error creating OT: ${error.message}` };
  }
}
export async function editOtEntry(prevData, formData) {
  try {
    const authCheck = await checkAuthPermission(perm.OT_SLIP_EDIT);

    if (!authCheck.success) {
      return authCheck;
    }

    const dataString = formData.get("data");
    const parsedData = JSON.parse(dataString);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      return { success: false, message: "No data provided." };
    }

    const { Date, Type, Unit, WorkDescription, Employee, Remarks, Dept } =
      parsedData;
    if (!Date || !Type || !Unit || !WorkDescription || !Employee || !Dept) {
      return { success: false, message: "All fields are required." };
    }

    const hasEmptyValues = Employee.some((emp) =>
      Object.values(emp).some((value) => value.trim() === "")
    );

    if (hasEmptyValues) {
      return { success: false, message: "Please fill up Employees section." };
    }

    const result = await updateOtById(parsedData);

    if (result.modifiedCount > 0) {
      revalidatePath(`/${Dept}`);
      revalidatePath(`/${Dept}/overtime`);
      revalidatePath(`/${Dept}/overtime/daily`);
      revalidatePath(`/${Dept}/overtime/monthly`);
      return { success: true, message: "Data updated successfully" };
    }

    return { success: false, message: "Failed to save or no change made!" };
  } catch (error) {
    console.error("Error creating OT entry:", error);
    return { success: false, message: `Error creating OT: ${error.message}` };
  }
}

export async function deleteOtEntry(id, dept) {
  try {
    const authCheck = await checkAuthPermission(perm.OT_SLIP_DELETE);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!id) return { success: false, message: "Missing ID" };
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid ID format" };
    }

    const result = await OVERTIME_COLLECTION.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Document not found!" };
    }
    revalidatePath(`/${dept}`);
    revalidatePath(`/${dept}/overtime`);
    revalidatePath(`/${dept}/overtime/daily`);
    revalidatePath(`/${dept}/overtime/monthly`);

    return { success: true, message: "Deleted successfully!" };
  } catch (error) {
    console.error("Error deleting report", error);
    return { success: false, message: `Error deleting doc: ${error.message}` };
  }
}
