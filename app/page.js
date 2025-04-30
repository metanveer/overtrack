import checkAuthPermission from "@/utils/checkAuthPermission";
import Login from "./components/auth/Login";
import CustomLink from "./components/CustomLink";
import LayoutShell from "./components/layout/LayoutShell";
import { getPermittedDepts } from "@/lib/mongodb/deptQueries";
import { adminOptions } from "./admin/admin-options";

export default async function HomePage() {
  const { success, session } = await checkAuthPermission();

  if (!success) {
    return <Login />;
  }

  const isAdmin = session.user.role === "Admin";

  const { deptLinks } = await getPermittedDepts(session.user.role);

  const homeLinks = isAdmin ? [...adminOptions, ...deptLinks] : deptLinks;

  return (
    <LayoutShell navLinks={homeLinks} session={session}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeLinks.length > 0
          ? homeLinks.map((dept) => (
              <CustomLink key={dept.href} label={dept.label} href={dept.href} />
            ))
          : "No department to show!"}
      </div>
    </LayoutShell>
  );
}
