import CustomLink from "@/app/components/CustomLink";
import React from "react";

const Settings = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Overtime</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomLink href={`/overtime/settings`} label={"Overtime Settings"} />
        {/* Add more <CustomLink /> components as needed */}
        <CustomLink href={`/overtime/entry-form`} label={"OT Entry Form"} />
        <CustomLink href={`/overtime/report`} label={"OT Entry Log"} />
        <CustomLink href={`/overtime/report/daily`} label={"Daily OT"} />
        <CustomLink href={`/overtime/report/monthly`} label={"Monthly OT"} />

        {/* Repeat the links as necessary */}
      </div>
    </div>
  );
};

export default Settings;
