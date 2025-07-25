import LayoutShell from "../components/layout/LayoutShell"; // client layout
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";

import AccessDenied from "../components/auth/AccessDenied";
import { redirect } from "next/navigation";
import getNavLinks from "@/utils/getNavLinks";

export const metadata = {
  title: "Overtime Track",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children, params }) {
  const { dept } = await params;

  const { success, session } = await checkAuthPermission(`DEPARTMENT__${dept}`);

  if (!session || !success) redirect("/");

  const { Employee, Unit, OtType, OtTime } = await getOtSettings(dept);

  const navLinks = getNavLinks(Employee, Unit, OtType, OtTime, dept);

  return (
    <LayoutShell dept={dept} navLinks={navLinks} session={session}>
      {children}
    </LayoutShell>
  );
}
