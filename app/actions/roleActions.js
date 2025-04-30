"use server";

import {
  deleteRoleByName,
  getRoleByName,
  insertRole,
  renameRoleById,
  updatePermByRoleName,
} from "@/lib/mongodb/roleQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import genRandomNum from "@/utils/genRandomNum";
import { perm } from "@/utils/permissions";

import { revalidatePath } from "next/cache";

export async function createRole(roleName) {
  try {
    const authCheck = await checkAuthPermission(perm.ROLE_ADD);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!roleName) {
      return {
        success: false,
        message: "Role name is required!",
      };
    }

    if (roleName.trim() === "") {
      return {
        success: false,
        message: `Empty name is not allowed!`,
      };
    }

    // Check if the email already exists
    const existingRole = await getRoleByName(roleName);
    if (existingRole) {
      return {
        success: false,
        message: "Role already exists!",
      };
    }

    const newRole = {
      roleName,

      permissions: [],
    };

    const res = await insertRole(newRole);

    if (res.acknowledged) {
      revalidatePath("/admin/roles");

      return { success: true, message: "Role created successfully." };
    }
    return { success: false, message: "Failed to create role." };
  } catch (error) {
    console.error("Error adding role:", error);
    return {
      success: false,
      message: `Error adding role: ${error.message}`,
    };
  }
}
export async function duplicateRole(roleName) {
  try {
    const authCheck = await checkAuthPermission(perm.ROLE_ADD);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!roleName) {
      return {
        success: false,
        message: "Role name is required!",
      };
    }

    if (roleName.trim() === "") {
      return {
        success: false,
        message: `Empty name is not allowed!`,
      };
    }

    const existingRole = await getRoleByName(roleName);

    const newRole = {
      roleName: `${existingRole.roleName}_${genRandomNum()}`,

      permissions: existingRole.permissions,
    };

    const res = await insertRole(newRole);

    if (res.acknowledged) {
      revalidatePath("/admin/roles");

      return { success: true, message: "Role copied successfully." };
    }
    return { success: false, message: "Failed to create duplicate role." };
  } catch (error) {
    console.error("Error adding role:", error);
    return {
      success: false,
      message: `Error adding role: ${error.message}`,
    };
  }
}

export async function renameRole(_id, roleName) {
  try {
    const authCheck = await checkAuthPermission(perm.ROLE_RENAME);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!_id || !roleName) {
      return { success: false, message: "Id or name is missing" };
    }
    if (roleName.trim() === "") {
      return { success: false, message: "Empty name is not allowed!" };
    }

    // Check if the email already exists
    const existingRole = await getRoleByName(roleName);
    if (existingRole) {
      return {
        success: false,
        message: "Role with the chosen name already exists!",
      };
    }

    const res = await renameRoleById(_id, roleName);

    if (res.modifiedCount > 0) {
      revalidatePath("/admin/roles");

      return { success: true, message: "Data updated successfully" };
    }

    return { success: false, message: "Failed to save or no change made!" };
  } catch (error) {
    console.error("Error updating bill:", error);
    return { success: false, message: `Error updating bill: ${error.message}` };
  }
}

export async function deleteRole(roleName) {
  try {
    const authCheck = await checkAuthPermission(perm.ROLE_DELETE);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!roleName) {
      return { success: false, message: "Role name is required!" };
    }

    // Check if user exists
    const existingRole = await getRoleByName(roleName);
    if (!existingRole) {
      return { success: false, message: "Role not found!" };
    }

    // Delete user

    const res = await deleteRoleByName(roleName);

    if (res.deletedCount > 0) {
      return {
        success: true,
        message: "Role deleted successfully",
      };
    }

    return {
      success: false,
      message: "Failed to delete role",
    };
  } catch (error) {
    console.log("Error deleting role:", error);
    return { error: "Error deleting role" };
  }
}

export async function updateRolePermissions(roleName, permissions) {
  try {
    const authCheck = await checkAuthPermission();

    if (!authCheck.success) {
      return authCheck;
    }

    const hasPermission = authCheck.user.role === "Admin";

    if (!hasPermission) {
      return {
        success: false,
        message: "Admin only permission!",
      };
    }

    const res = await updatePermByRoleName(roleName, permissions);

    console.log("res in update perm", res);

    if (res.modifiedCount > 0) {
      return { success: true, message: "Permissions updated successfully" };
    }

    return { success: false, message: "Failed to update permission!" };
  } catch (error) {
    console.log("Error updating permissions:", error);
    return {
      success: false,
      message: `Error updating permissions: ${error.message}`,
    };
  }
}
