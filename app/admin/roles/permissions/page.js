import PermissionsManager from "@/app/components/role/PermissionsManager";
import { initRole } from "@/utils/permissions";
import React from "react";

const EditPermPage = async ({ searchParams }) => {
  const { role } = await searchParams;
  return (
    <div>
      {role}
      <PermissionsManager initRole={initRole} />
    </div>
  );
};

export default EditPermPage;
