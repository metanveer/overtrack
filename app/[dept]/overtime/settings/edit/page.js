import OtSettingsEdit from "@/app/components/OtSettingsEdit";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import React from "react";

const SettingsEditPage = async ({ params }) => {
  const { dept } = await params;
  const settings = await getOtSettings(dept);

  return <OtSettingsEdit deptName={dept} dataFromDb={settings} />;
};

export default SettingsEditPage;
