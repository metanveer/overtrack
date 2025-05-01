"use server";

import bcrypt from "bcryptjs";

import {
  deleteUserById,
  getUserByEmail,
  getUserById,
  insertUser,
  updateUserById,
} from "@/lib/mongodb/userQueries";
import { revalidatePath } from "next/cache";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";

export async function createUser(formData) {
  try {
    const authCheck = await checkAuthPermission(perm.USERS_ADD);

    if (!authCheck.success) {
      return authCheck;
    }

    const { name, email, password, role, dept } = formData;

    if (!name || !email || !password || !role || !dept) {
      return { success: false, message: "All fields are required!" };
    }

    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists. Please use a different email.",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      dept,
      role,
    };

    const res = await insertUser(newUser);

    if (res) {
      revalidatePath(`/admin/users`);

      return { success: true, message: "User created successfully" };
    }
    return { success: false, message: "Failed to create user" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: `Error creating user: ${error.message}` };
  }
}
export async function registerUser(formData) {
  try {
    const { name, email, password, role, dept } = formData;

    if (!name || !email || !password || !role || !dept) {
      return { success: false, message: "All fields are required!" };
    }

    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already exists. Please use a different email.",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      dept,
      role,
    };

    const res = await insertUser(newUser);

    if (res) {
      revalidatePath(`/admin/users`);

      return { success: true, message: "User created successfully" };
    }
    return { success: false, message: "Failed to create user" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: `Error creating user: ${error.message}` };
  }
}

export async function updateUser(formData) {
  try {
    const authCheck = await checkAuthPermission(perm.USERS_EDIT);

    if (!authCheck.success) {
      return authCheck;
    }

    const { _id, name, email, password, role, dept } = formData;

    if (!_id) return { success: false, message: "User ID is required!" };

    // Find existing user
    const existingUser = await getUserById(_id);
    if (!existingUser) {
      return { success: false, message: "User not found!" };
    }

    // Prepare update fields with previous values if not provided
    const updateFields = {
      name: name || existingUser.name,
      email: email ? email.toLowerCase() : existingUser.email,
      role: role || existingUser.role,
      dept: dept || existingUser.dept,
    };

    // Hash password only if a new one is provided, else retain the old password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      updateFields.password = hashedPassword;
    } else {
      updateFields.password = existingUser.password;
    }

    // Update user
    const res = await updateUserById(_id, updateFields);

    if (res) {
      return {
        success: true,
        message: "User updated successfully!",
      };
    }

    return {
      success: false,
      message: "Failed update user or user data was not changed",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: `Error updating user: ${error.message}` };
  }
}

export async function deleteUser(userId) {
  try {
    const authCheck = await checkAuthPermission(perm.USERS_DELETE);

    if (!authCheck.success) {
      return authCheck;
    }

    if (!userId) {
      return {
        success: false,
        message: "Missing user id!",
      };
    }

    // Check if user exists
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    // Delete user
    const res = await deleteUserById(userId);

    if (res) {
      return {
        success: true,
        message: "User deleted successfully!",
      };
    }

    return {
      success: false,
      message: "Failed to delete user!",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Error deleting user" };
  }
}
