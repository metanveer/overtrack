import CustomLink from "@/app/components/CustomLink";
import React from "react";

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink
          href={`/overtime/settings/edit`}
          label={"Edit Dropdown Options"}
        />
        {/* Add more <CustomLink /> components as needed */}
        <CustomLink
          href={`/overtime/settings/monthly-data`}
          label={"Edit Monthly Employee Data"}
        />

        {/* Repeat the links as necessary */}
      </div>
    </div>
  );
};

export default Settings;
