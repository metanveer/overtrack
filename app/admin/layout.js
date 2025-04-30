import { perm } from "@/utils/permissions";
import LayoutShell from "../components/layout/LayoutShell";
import { adminOptions } from "./admin-options";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Overtime Track | Admin Page",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children }) {
  const { success, session } = await checkAuthPermission(perm.VIEW_ADMIN_PAGE);

  if (!success) redirect("/");

  return (
    <LayoutShell navLinks={adminOptions} session={session}>
      {children}
    </LayoutShell>
  );
}
