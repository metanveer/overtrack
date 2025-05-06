import { getUserByEmail } from "@/lib/mongodb/userQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { notFound, redirect } from "next/navigation";
import UserProfile from "../components/user/UserProfile";

import { getPermittedDepts } from "@/lib/mongodb/deptQueries";

const ProfilePage = async () => {
  const { success, session } = await checkAuthPermission("isLoggedIn");

  if (!success) redirect("/");

  const user = await getUserByEmail(session.user.email);

  if (!user || Object.keys(user).length === 0) return notFound();

  const { roleData } = await getPermittedDepts(session.user.role);

  return (
    <>
      <UserProfile user={user} role={roleData} />
    </>
  );
};

export default ProfilePage;
