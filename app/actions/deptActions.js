"use server";
import { DEPT_COLLECTION } from "@/lib/mongodb/db";
import {
  getDeptByName,
  insertDept,
  updateDept,
} from "@/lib/mongodb/deptQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function addDept(label) {
  try {
    const authCheck = await checkAuthPermission(perm.DEPTS_ADD);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!label) {
      return {
        success: false,
        message: `Department name is required!`,
      };
    }

    if (label.trim() === "") {
      return {
        success: false,
        message: `Empty name is not allowed!`,
      };
    }

    const existingDept = await getDeptByName(label);

    if (existingDept) {
      return {
        success: false,
        message: `Department with the same name is already exist!`,
      };
    }

    const dept = {
      deptName: label,
      href: `/${label}`,
    };

    const newDept = await insertDept(dept);

    if (newDept.acknowledged) {
      revalidatePath("/admin/depts");

      return { success: true, message: "Dept created successfully." };
    }
    return { success: false, message: "Failed to create Department." };
  } catch (error) {
    console.error("Error adding department:", error);
    return {
      success: false,
      message: `Error adding department: ${error.message}`,
    };
  }
}

export async function editDept(_id, deptName) {
  try {
    const authCheck = await checkAuthPermission(perm.DEPTS_RENAME);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!_id || !deptName) {
      return { success: false, message: "Id or name is missing" };
    }
    if (deptName.trim() === "") {
      return { success: false, message: "Empty name is not allowed!" };
    }

    const dept = {
      deptName: deptName,
      href: `/${deptName}`,
    };

    const updatedDept = await updateDept(_id, dept);

    if (updatedDept.modifiedCount > 0) {
      revalidatePath("/admin/depts");

      return { success: true, message: "Data updated successfully" };
    }

    return { success: false, message: "Failed to save or no change made!" };
  } catch (error) {
    console.error("Error updating bill:", error);
    return { success: false, message: `Error updating bill: ${error.message}` };
  }
}

export async function deleteDept(id) {
  try {
    const authCheck = await checkAuthPermission(perm.DEPTS_DELETE);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!id) return { success: false, message: "Missing month!" };

    const _id = new ObjectId(id);

    const result = await DEPT_COLLECTION.deleteOne({
      _id: _id,
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Document not found!" };
    }
    revalidatePath(`/admin/depts`);

    return { success: true, message: "Deleted successfully!" };
  } catch (error) {
    console.error("Error deleting report", error);
    return { success: false, message: `Error deleting doc: ${error.message}` };
  }
}
