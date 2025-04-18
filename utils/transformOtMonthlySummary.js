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

export const transformOTMonthlySummary = (data) => {
  const employeeSet = new Set();
  const employeeMap = {};

  data.forEach((day) => {
    const date = day._id;
    day.records.forEach((record) => {
      record.Employee.forEach((emp) => {
        const name = emp.Name;
        const hours = parseInt(emp.OtHour, 10) || 0;

        employeeSet.add(name);

        if (!employeeMap[name]) {
          employeeMap[name] = { total: 0 };
        }

        employeeMap[name][date] = (employeeMap[name][date] || 0) + hours;
        employeeMap[name].total += hours;
      });
    });
  });

  const allDates = getAllDatesInMonth(data);

  const dayTotals = {};
  allDates.forEach((date) => {
    dayTotals[date] = 0;
    for (const emp of employeeSet) {
      dayTotals[date] += employeeMap[emp]?.[date] || 0;
    }
  });

  const grandTotal = Object.values(employeeMap).reduce(
    (acc, emp) => acc + emp.total,
    0
  );

  // Get top 3 highest total OT
  const sortedEmployees = Object.entries(employeeMap)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name]) => name);
  const topThree = new Set(sortedEmployees.slice(0, 3));

  return {
    allDates,
    employeeList: Array.from(employeeSet),
    employeeMap,
    dayTotals,
    grandTotal,
    topThree,
  };
};
