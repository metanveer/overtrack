import CustomLink from "@/app/components/CustomLink";
import React from "react";

const Settings = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink href={`/overtime/settings`} label={"Settings"} />

        <CustomLink href={`/overtime/entry-form`} label={"OT Entry Form"} />
        <CustomLink href={`/overtime/report`} label={"All OT Entries"} />
        <CustomLink href={`/overtime/report/daily`} label={"Daily OT"} />
        <CustomLink href={`/overtime/report/monthly`} label={"Monthly OT"} />
        <CustomLink
          href={`/overtime/report/employee`}
          label={"Employee OT Records"}
        />
      </div>
    </>
  );
};

export default Settings;
