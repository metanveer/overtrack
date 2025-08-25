import getMonthStartAndEnd from "./getMonthStartAndEnd";

export default function getNavLinks(employees, units, otTypes, otHours, dept) {
  const today = new Date();
  const selectedDate = today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  const yearMonth = today.toISOString().slice(0, 7);
  const year = today.getFullYear();

  const { start, end } = getMonthStartAndEnd(selectedDate);

  if (
    !employees?.length ||
    !units?.length ||
    !otTypes?.length ||
    !otHours?.length
  ) {
    return [{ href: `/${dept}/settings`, label: "Settings" }];
  }

  const firstEmp = employees ? employees[0].Name : "";
  const firstUnit = units ? units[0] : "";
  const firstOtType = otTypes ? otTypes[0] : "";

  return [
    { href: `/${dept}/updates`, label: "New Features" },
    { href: `/${dept}`, label: "Dashboard" },
    { href: `/${dept}/entry-form`, label: "Add Overtime" },
    {
      href: `/${dept}/monthly?month=${yearMonth}&create_notice=true`,
      label: "Create Holiday Notice",
    },
    {
      href: `/${dept}/daily?date=${selectedDate}`,
      label: "Daily Report",
    },
    {
      href: `/${dept}/monthly?month=${yearMonth}`,
      label: "Monthly Report",
    },
    {
      href: `/${dept}/yearly?year=${year}`,
      label: "Yearly Report",
    },
    {
      href: `/${dept}/employee?start=${start}&end=${end}&name=${firstEmp}`,
      label: "Employee Records",
    },
    {
      href: `/${dept}/unit?start=${start}&end=${end}&name=${firstUnit}`,
      label: "Unit Records",
    },
    {
      href: `/${dept}/unit/summary?start=${start}&end=${end}`,
      label: "Units Summary",
    },
    {
      href: `/${dept}/ot-type?start=${start}&end=${end}&name=${firstOtType}`,
      label: "OT Type Records",
    },
    { href: `/${dept}/billing?month=${yearMonth}`, label: "Billing" },
    { href: `/${dept}/settings`, label: "Settings" },
  ];
}
