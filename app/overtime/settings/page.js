import CustomLink from "@/app/components/CustomLink";
import React from "react";

const Settings = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink
          href={`/overtime/settings/edit`}
          label={"Edit Dropdown Options"}
        />
      </div>
    </div>
  );
};

export default Settings;
