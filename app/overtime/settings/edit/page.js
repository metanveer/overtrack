import OtSettingsEdit from "@/app/components/OtSettingsEdit";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import React from "react";

const SettingsEditPage = async () => {
  const settings = await getOtSettings();

  return <OtSettingsEdit dataFromDb={settings} />;
};

export default SettingsEditPage;
