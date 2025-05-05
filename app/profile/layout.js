import { getUserByEmail } from "@/lib/mongodb/userQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { notFound, redirect } from "next/navigation";

import LayoutShell from "../components/layout/LayoutShell";
import { getPermittedDepts } from "@/lib/mongodb/deptQueries";
import { adminOptions } from "../admin/admin-options";

const ProfileLayout = async ({ children }) => {
  const { success, session } = await checkAuthPermission();

  if (!success) redirect("/");

  const user = await getUserByEmail(session.user.email);

  if (!user || Object.keys(user).length === 0) return notFound();

  const { deptLinks } = await getPermittedDepts(session.user.role);

  const isAdmin = session.user.role === "Admin";

  const navLinks = isAdmin ? [...adminOptions, ...deptLinks] : deptLinks;

  return (
    <LayoutShell navLinks={navLinks} session={session}>
      {children}
    </LayoutShell>
  );
};

export default ProfileLayout;
