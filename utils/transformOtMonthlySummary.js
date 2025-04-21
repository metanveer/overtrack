const getAllDatesInMonth = (data) => {
  const allDatesSet = new Set();
  data.forEach((day) => allDatesSet.add(day._id));
  const sampleDate = data[0]?._id;
  const [year, month] = sampleDate.split("-");
  const daysInMonth = new Date(year, parseInt(month), 0).getDate();

  const allDates = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${month}-${d.toString().padStart(2, "0")}`;
    allDates.push(dateStr);
  }

  return allDates;
};

const roundForDisplay = (num) => num.toFixed(1); // Display rounding to 1 decimal

export const transformOTMonthlySummary = (data, preferredOrder = []) => {
  console.log("data to transform", JSON.stringify(data, null, 2));

  const employeeSet = new Set();
  const employeeMap = {};

  data.forEach((day) => {
    const date = day._id;
    day.records.forEach((record) => {
      record.Employee.forEach((emp) => {
        const name = emp.Name;
        const hours = parseFloat(emp.OtHour) || 0;

        employeeSet.add(name);

        if (!employeeMap[name]) {
          employeeMap[name] = { total: 0 };
        }

        // Full precision calculation
        const currentHours = employeeMap[name][date] || 0;
        const newTotal = currentHours + hours;

        employeeMap[name][date] = newTotal;
        employeeMap[name].total += hours;
      });
    });
  });

  const allDates = getAllDatesInMonth(data);
  const dayTotals = {};

  allDates.forEach((date) => {
    const matchingDay = data.find((d) => d._id === date);
    const total = matchingDay?.totalOtHours
      ? parseFloat(matchingDay.totalOtHours)
      : 0;
    dayTotals[date] = total;
  });

  // Grand total calculation
  const grandTotal = Object.values(dayTotals).reduce((sum, h) => sum + h, 0);

  // Sort employees by total OT hours
  const sortedEmployees = Object.entries(employeeMap)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name]) => name);

  const topThree = new Set(sortedEmployees.slice(0, 3));

  const employeeList = Array.from(employeeSet);

  const orderedEmployeeList = employeeList.sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);

    // Employees not in preferredOrder go to the end in original order
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return {
    allDates,
    employeeList: orderedEmployeeList, // Sorted by OT hours
    employeeMap: Object.fromEntries(
      Object.entries(employeeMap).map(([name, data]) => [
        name,
        {
          total: roundForDisplay(data.total), // Display rounding
          ...Object.fromEntries(
            Object.entries(data).map(([date, hours]) => [
              date,
              roundForDisplay(hours), // Display rounding
            ])
          ),
        },
      ])
    ),
    dayTotals: Object.fromEntries(
      Object.entries(dayTotals).map(([date, total]) => [
        date,
        roundForDisplay(total), // Display rounding
      ])
    ),
    grandTotal: roundForDisplay(grandTotal), // Display rounding
    topThree,
  };
};
