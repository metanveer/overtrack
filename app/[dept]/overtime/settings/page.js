import CustomLink from "@/app/components/CustomLink";
import React from "react";

const Settings = async ({ params }) => {
  const { dept } = await params;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink
          href={`/${dept}/overtime/settings/edit`}
          label={"Edit Dropdown Options"}
        />
      </div>
    </div>
  );
};

export default Settings;
