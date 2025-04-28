"use server";

import { auth } from "@/auth";
import { getRoleByName } from "@/lib/mongodb/roleQueries";

async function checkRolePermission(role, perm) {
  const roleData = await getRoleByName(role);

  if (!roleData) return false;

  return roleData.permissions.includes(perm);
}

export default async function checkAuthPermission(action) {
  const session = await auth();

  if (!session || !session.user || !session.user.role || !session.user.dept) {
    return { success: false, message: "Access denied!" };
  }

  if (!action) {
    return { success: true, user: session.user, session: session };
  }

  const hasPermission = await checkRolePermission(session.user.role, action);

  if (!hasPermission) {
    return { success: false, message: "Permission denied!" };
  }

  return { success: true, user: session.user, session: session };
}
