import React from "react";

import { getAllRoles } from "@/lib/mongodb/roleQueries";
import RoleCard from "@/app/components/role/RoleCard";
import AddRoleBtn from "@/app/components/role/AddRoleBtn";
import AccessDenied from "@/app/components/auth/AccessDenied";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";

async function RolesPage() {
  const authCheck = await checkAuthPermission(perm.VIEW_ROLES_PAGE);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const roles = await getAllRoles();

  return (
    <div className="text-center">
      <AddRoleBtn />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((item) => (
          <RoleCard id={item._id} key={item._id} roleName={item.roleName} />
        ))}
      </div>
    </div>
  );
}

export default RolesPage;
