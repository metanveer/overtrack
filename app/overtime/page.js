import CustomLink from "@/app/components/CustomLink";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";
import React from "react";

const Settings = async () => {
  const { Employee } = await getOtSettings();

  const today = new Date();
  const selectedDate = today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  const yearMonth = today.toISOString().slice(0, 7);

  const { start, end } = getMonthStartAndEnd(selectedDate);

  const firstEmp = Employee[0].Name;

  const navLinks = [
    { href: "/overtime/entry-form", label: "Entry Form" },
    { href: "/overtime", label: "Overtime" },
    { href: `/overtime/daily?date=${selectedDate}`, label: "Daily" },
    { href: `/overtime/monthly?month=${yearMonth}`, label: "Monthly" },
    {
      href: `/overtime/employee?start=${start}&end=${end}&name=${firstEmp}`,
      label: "Employee Records",
    },
    {
      href: `/overtime/unit?start=${start}&end=${end}&name=Topping`,
      label: "Unit Records",
    },
    { href: `/overtime/billing?month=${yearMonth}`, label: "Billing" },
    { href: "/overtime/settings", label: "Settings" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navLinks
          .filter((item) => item.href !== "/overtime")
          .map((item) => (
            <CustomLink key={item.href} href={item.href} label={item.label} />
          ))}
      </div>
    </>
  );
};

export default Settings;
