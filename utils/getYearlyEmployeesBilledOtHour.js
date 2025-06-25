export default function getYearlyEmployeesBilledOtHour(monthlyRecords) {
  const monthNames = {
    "01": "january",
    "02": "february",
    "03": "march",
    "04": "april",
    "05": "may",
    "06": "june",
    "07": "july",
    "08": "august",
    "09": "september",
    10: "october",
    11: "november",
    12: "december",
  };
  const employeeMap = {};

  monthlyRecords.forEach(({ billMonth, billData }) => {
    const monthKey = monthNames[billMonth.slice(5)];

    billData.forEach(({ name, bill }) => {
      if (!employeeMap[name]) {
        employeeMap[name] = { name };
      }
      employeeMap[name][monthKey] = bill;
    });
  });

  return Object.values(employeeMap);
}
