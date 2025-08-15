import AccessDenied from "@/app/components/auth/AccessDenied";
import OtSettingsEdit from "@/app/components/OtSettingsEdit";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import React from "react";

const SettingsEditPage = async ({ params }) => {
  const authCheck = await checkAuthPermission(perm.SETTINGS_EDIT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const { dept } = await params;
  const settings = await getOtSettings(dept);

  return <OtSettingsEdit deptName={dept} dataFromDb={settings} />;
};

export default SettingsEditPage;
