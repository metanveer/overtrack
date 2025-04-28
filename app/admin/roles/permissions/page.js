import PermissionsManager from "@/app/components/role/PermissionsManager";
import { getRoleByName } from "@/lib/mongodb/roleQueries";

import React from "react";

const EditPermPage = async ({ searchParams }) => {
  const { role } = await searchParams;

  const initRole = await getRoleByName(role);

  return (
    <div>
      {role}
      <PermissionsManager initRole={initRole} />
    </div>
  );
};

export default EditPermPage;
