"use server";

// import checkAuthPermission from "@/utils/checkAuthPermission";

// import { ObjectId } from "mongodb";
// import { perm } from "../data/permissionsData";
// import { auth } from "@/auth";
import {
  deleteRoleByName,
  getRoleByName,
  insertRole,
} from "@/lib/mongodb/roleQueries";
import { revalidatePath } from "next/cache";

export async function createRole(roleName) {
  try {
    // const authCheck = await checkAuthPermission(perm.addRole);

    // if (authCheck.error) {
    //   return authCheck;
    // }

    // const dataString = formData.get("data");
    // const parsedData = JSON.parse(dataString);

    // const { roleName } = parsedData;

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

export async function deleteRole(roleName) {
  try {
    // const authCheck = await checkAuthPermission(perm.deleteRole);

    // if (authCheck.error) {
    //   return authCheck;
    // }

    // const dataString = formData.get("data");
    // const parsedData = JSON.parse(dataString);
    // const { roleName } = parsedData;

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

export async function updateRolePermissions(roleSlug, permissions) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.role) {
      return { error: "Access denied!" };
    }

    const hasPermission = session.user.role === "admin";

    if (!hasPermission) {
      return { error: "Sorry! You don't have the required permission!" };
    }

    const res = await rolesCollection.updateOne(
      { slug: roleSlug },
      { $set: { permissions } }
    );

    if (res.modifiedCount > 0) {
      return { success: true, message: "Permissions updated successfully" };
    }

    return { error: "Failed to update permission!" };
  } catch (error) {
    console.log("Error updating permissions:", error);
    return { error: "Error updating permissions" };
  }
}
