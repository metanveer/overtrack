import AdminLayoutShell from "./AdminLayoutShell";

export const metadata = {
  title: "Overtime Track | Admin Page",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
