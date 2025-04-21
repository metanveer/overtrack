import CustomLink from "@/app/components/CustomLink";
import React from "react";

const Settings = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink href={`/overtime/settings`} label={"Settings"} />
        <CustomLink href={`/overtime/entry-form`} label={"Entry Form"} />
        <CustomLink href={`/overtime/daily`} label={"Daily Overtime"} />
        <CustomLink href={`/overtime/monthly`} label={"Monthly Overtime"} />
        <CustomLink href={`/overtime/employee`} label={"Employee Records"} />
        <CustomLink href={`/overtime/unit`} label={"Unit Records"} />
        <CustomLink href={`/overtime/billing`} label={"Billing"} />
      </div>
    </>
  );
};

export default Settings;
