import getMonthStartAndEnd from "./getMonthStartAndEnd";

export default function getNavLinks(employees, units, otTypes, otHours, dept) {
  const today = new Date();
  const selectedDate = today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  const yearMonth = today.toISOString().slice(0, 7);

  const { start, end } = getMonthStartAndEnd(selectedDate);

  if (
    !employees?.length ||
    !units?.length ||
    !otTypes?.length ||
    !otHours?.length
  ) {
    return [{ href: `/${dept}/overtime/settings`, label: "Settings" }];
  }

  const firstEmp = employees ? employees[0].Name : "";
  const firstUnit = units ? units[0] : "";
  const firstOtType = otTypes ? otTypes[0] : "";

  return [
    { href: `/${dept}/overtime/entry-form`, label: "Entry Form" },
    { href: `/${dept}/overtime`, label: "Menu" },
    {
      href: `/${dept}/overtime/daily?date=${selectedDate}`,
      label: "Daily Report",
    },
    {
      href: `/${dept}/overtime/monthly?month=${yearMonth}`,
      label: "Monthly Report",
    },
    {
      href: `/${dept}/overtime/employee?start=${start}&end=${end}&name=${firstEmp}`,
      label: "Employee Records",
    },
    {
      href: `/${dept}/overtime/unit?start=${start}&end=${end}&name=${firstUnit}`,
      label: "Unit Records",
    },
    {
      href: `/${dept}/overtime/ot-type?start=${start}&end=${end}&name=${firstOtType}`,
      label: "OT Type Records",
    },
    { href: `/${dept}/overtime/billing?month=${yearMonth}`, label: "Billing" },
    { href: `/${dept}/overtime/settings`, label: "Settings" },
  ];
}
