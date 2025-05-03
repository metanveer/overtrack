"use server";
import { DEPT_COLLECTION } from "@/lib/mongodb/db";
import {
  getDeptByName,
  insertDept,
  updateDept,
} from "@/lib/mongodb/deptQueries";
import {
  deleteOtSettings,
  saveOtSettingsToDb,
} from "@/lib/mongodb/oTSettingsQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { defaultOtSettings } from "@/utils/defaultOtSettings";
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
      revalidatePath("/");
      revalidatePath("/admin/depts");
      revalidatePath("/admin/roles/permissions");

      const deptSettings = await saveOtSettingsToDb(
        defaultOtSettings(dept.deptName)
      );

      if (deptSettings.acknowledged && deptSettings.modifiedCount > 0) {
        revalidatePath(`/`);
        revalidatePath(`/${dept}`);
        revalidatePath(`/${dept}/overtime`);
        revalidatePath(`/${dept}/overtime/entry-form`);
        revalidatePath(`/${dept}/overtime/settings/edit`);

        // return { success: true, message: "Settings updated successfully!" };
      }

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
      revalidatePath("/");
      revalidatePath("/admin/depts");
      revalidatePath("/admin/roles/permissions");

      const deptSettings = await saveOtSettingsToDb(
        defaultOtSettings(dept.deptName)
      );

      if (deptSettings.acknowledged && deptSettings.modifiedCount > 0) {
        revalidatePath(`/`);
        revalidatePath(`/${dept}`);
        revalidatePath(`/${dept}/overtime`);
        revalidatePath(`/${dept}/overtime/entry-form`);
        revalidatePath(`/${dept}/overtime/settings/edit`);

        // return { success: true, message: "Settings updated successfully!" };
      }

      return { success: true, message: "Data updated successfully" };
    }

    return { success: false, message: "Failed to save or no change made!" };
  } catch (error) {
    console.error("Error updating bill:", error);
    return { success: false, message: `Error updating bill: ${error.message}` };
  }
}

export async function deleteDept(deptName) {
  try {
    const authCheck = await checkAuthPermission(perm.DEPTS_DELETE);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!deptName) return { success: false, message: "Missing dept name!" };

    const result = await DEPT_COLLECTION.deleteOne({
      deptName: deptName,
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Document not found!" };
    }

    const delSetting = await deleteOtSettings(deptName);

    revalidatePath("/");
    revalidatePath("/admin/depts");
    revalidatePath("/admin/roles/permissions");

    return { success: true, message: "Deleted successfully!" };
  } catch (error) {
    console.error("Error deleting report", error);
    return { success: false, message: `Error deleting doc: ${error.message}` };
  }
}
