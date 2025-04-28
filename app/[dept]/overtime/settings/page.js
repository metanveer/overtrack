import AccessDenied from "@/app/components/auth/AccessDenied";
import CustomLink from "@/app/components/CustomLink";
import SettingsView from "@/app/components/SettingsView";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import React from "react";

const Settings = async ({ params }) => {
  const authCheck = await checkAuthPermission(perm.SETTINGS_VIEW);

  if (!authCheck.success) return <AccessDenied />;

  const { dept } = await params;

  const data = await getOtSettings(dept);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink
          href={`/${dept}/overtime/settings/edit`}
          label={"Edit Dropdown Options"}
        />
      </div>
      <SettingsView settingsData={data} />
    </div>
  );
};

export default Settings;
