"use server";

import { auth } from "@/auth";
import { getRoleByName } from "@/lib/mongodb/roleQueries";

// Helper function to check if a role has a specific permission
async function checkRolePermission(role, permission) {
  const roleData = await getRoleByName(role);

  if (!roleData) return false;

  return roleData.permissions.includes(permission);
}

// Main function to check authentication and permission
export default async function checkAuthPermission(permission) {
  const session = await auth();

  // Early return if session or required fields are missing
  if (!session || !session.user || !session.user.role || !session.user.dept) {
    return { success: false, message: "Access denied!", session: null };
  }

  // If no specific permission is required, just return the user info
  if (permission === "isLoggedIn") {
    return { success: true, user: session.user, session };
  }

  // Check if the user's role has the required permission
  const hasPermission = await checkRolePermission(
    session.user.role,
    permission
  );

  if (!hasPermission) {
    return { success: false, message: "Permission denied!", session };
  }

  return { success: true, user: session.user, session };
}
