import getMonthStartAndEnd from "./getMonthStartAndEnd";

export default function getNavLinks(employees, units) {
  const today = new Date();
  const selectedDate = today.toISOString().split("T")[0]; // returns YYYY-MM-DD
  const yearMonth = today.toISOString().slice(0, 7);

  const { start, end } = getMonthStartAndEnd(selectedDate);

  const firstEmp = employees[0].Name;
  const firstUnit = units[0];

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
      href: `/overtime/unit?start=${start}&end=${end}&name=${firstUnit}`,
      label: "Unit Records",
    },
    { href: `/overtime/billing?month=${yearMonth}`, label: "Billing" },
    { href: "/overtime/settings", label: "Settings" },
  ];

  return navLinks;
}
