import AccessDenied from "@/app/components/auth/AccessDenied";
import UserBtn from "@/app/components/user/UserBtn";
import UserCard from "@/app/components/user/UserCard";
import { getAllDepts } from "@/lib/mongodb/deptQueries";
import { getAllRoles } from "@/lib/mongodb/roleQueries";
import { getAllUsers } from "@/lib/mongodb/userQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import React from "react";

const UsersPage = async () => {
  const authCheck = await checkAuthPermission(perm.VIEW_USERS_PAGE);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const depts = await getAllDepts();
  const roles = await getAllRoles();
  const users = await getAllUsers();
  return (
    <>
      <div className="pb-6 text-center">
        <UserBtn depts={depts} roles={roles} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            name={user.name}
            email={user.email}
            dept={user.dept}
            role={user.role}
            depts={depts}
            roles={roles}
          />
        ))}
      </div>
    </>
  );
};

export default UsersPage;
