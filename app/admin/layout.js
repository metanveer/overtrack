import { auth } from "@/auth";
import AdminLayoutShell from "./AdminLayoutShell";

export const metadata = {
  title: "Overtime Track | Admin Page",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  console.log("SESSION IN DEPT LAYOUT", session);
  return <AdminLayoutShell session={session}>{children}</AdminLayoutShell>;
}
