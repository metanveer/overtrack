"use server";

import { auth } from "@/auth";
import { rolesCollection } from "@/db/mongodb";

async function checkPermission(role, perm) {
  const roleData = await rolesCollection.findOne({ slug: role });

  if (!roleData) return false;

  return roleData.permissions.includes(perm);
}

export default async function checkAuthPermission(action) {
  const session = await auth();

  if (!session || !session.user || !session.user.role) {
    return { error: "Access denied!" };
  }

  const hasPermission = await checkPermission(session.user.role, action);

  if (!hasPermission) {
    return { error: "Sorry! You don't have the required permission!" };
  }

  return { success: true, user: session.user };
}
