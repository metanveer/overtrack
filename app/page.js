import AdminLayoutShell from "./admin/AdminLayoutShell";
import checkAuthPermission from "@/utils/checkAuthPermission";
import Login from "./components/auth/Login";

export default async function HomePage({ params }) {
  const authCheck = await checkAuthPermission();

  if (authCheck.success) {
    return (
      <AdminLayoutShell session={authCheck.session}>Page</AdminLayoutShell>
    );
  }

  return <Login />;
}
