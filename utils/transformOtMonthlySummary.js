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

// export const transformOTMonthlySummary = (data) => {
//   const employeeSet = new Set();
//   const employeeMap = {};

//   data.forEach((day) => {
//     const date = day._id;
//     day.records.forEach((record) => {
//       record.Employee.forEach((emp) => {
//         const name = emp.Name;
//         const hours = parseInt(emp.OtHour, 10) || 0;

//         employeeSet.add(name);

//         if (!employeeMap[name]) {
//           employeeMap[name] = { total: 0 };
//         }

//         employeeMap[name][date] = (employeeMap[name][date] || 0) + hours;
//         employeeMap[name].total += hours;
//       });
//     });
//   });

//   const allDates = getAllDatesInMonth(data);

//   const dayTotals = {};
//   allDates.forEach((date) => {
//     dayTotals[date] = 0;
//     for (const emp of employeeSet) {
//       dayTotals[date] += employeeMap[emp]?.[date] || 0;
//     }
//   });

//   const grandTotal = Object.values(employeeMap).reduce(
//     (acc, emp) => acc + emp.total,
//     0
//   );

//   // Get top 3 highest total OT
//   const sortedEmployees = Object.entries(employeeMap)
//     .sort((a, b) => b[1].total - a[1].total)
//     .map(([name]) => name);
//   const topThree = new Set(sortedEmployees.slice(0, 3));

//   return {
//     allDates,
//     employeeList: Array.from(employeeSet),
//     employeeMap,
//     dayTotals,
//     grandTotal,
//     topThree,
//   };
// };

// export const transformOTMonthlySummary = (data) => {
//   const employeeSet = new Set();
//   const employeeMap = {};

//   data.forEach((day) => {
//     const date = day._id;
//     day.records.forEach((record) => {
//       record.Employee.forEach((emp) => {
//         const name = emp.Name;
//         const hours = parseFloat(emp.OtHour) || 0;

//         employeeSet.add(name);

//         if (!employeeMap[name]) {
//           employeeMap[name] = { total: 0 };
//         }

//         const currentHours = parseFloat(
//           (employeeMap[name][date] || 0).toFixed(1)
//         );
//         const newTotal = parseFloat((currentHours + hours).toFixed(1));

//         employeeMap[name][date] = newTotal;
//         employeeMap[name].total = parseFloat(
//           (employeeMap[name].total + hours).toFixed(1)
//         );
//       });
//     });
//   });

//   const allDates = getAllDatesInMonth(data);

//   const dayTotals = {};
//   allDates.forEach((date) => {
//     const matchingDay = data.find((d) => d._id === date);
//     const total = matchingDay?.totalOtHours
//       ? parseFloat(parseFloat(matchingDay.totalOtHours).toFixed(1))
//       : 0;
//     dayTotals[date] = total;
//   });

//   const grandTotal = parseFloat(
//     Object.values(dayTotals)
//       .reduce((sum, h) => sum + h, 0)
//       .toFixed(1)
//   );

//   const sortedEmployees = Object.entries(employeeMap)
//     .sort((a, b) => b[1].total - a[1].total)
//     .map(([name]) => name);
//   const topThree = new Set(sortedEmployees.slice(0, 3));

//   return {
//     allDates,
//     employeeList: Array.from(employeeSet),
//     employeeMap,
//     dayTotals,
//     grandTotal,
//     topThree,
//   };
// };

// export const transformOTMonthlySummary = (data) => {
//   const employeeSet = new Set();
//   const employeeMap = {};

//   data.forEach((day) => {
//     const date = day._id;
//     day.records.forEach((record) => {
//       record.Employee.forEach((emp) => {
//         const name = emp.Name;
//         const hours = parseFloat(emp.OtHour) || 0;

//         employeeSet.add(name);

//         if (!employeeMap[name]) {
//           employeeMap[name] = { total: 0 };
//         }

//         const currentHours = employeeMap[name][date] || 0;
//         const newTotal = currentHours + hours;

//         employeeMap[name][date] = newTotal;
//         employeeMap[name].total += hours;
//       });
//     });
//   });

//   const allDates = getAllDatesInMonth(data); // Assume this returns full month dates
//   const dayTotals = {};

//   allDates.forEach((date) => {
//     const matchingDay = data.find((d) => d._id === date);
//     const total = matchingDay?.totalOtHours
//       ? parseFloat(matchingDay.totalOtHours)
//       : 0;
//     dayTotals[date] = total;
//   });

//   const grandTotal = parseFloat(
//     Object.values(dayTotals)
//       .reduce((sum, h) => sum + h, 0)
//       .toFixed(1)
//   );

//   const sortedEmployees = Object.entries(employeeMap)
//     .sort((a, b) => b[1].total - a[1].total)
//     .map(([name]) => name);

//   const topThree = new Set(sortedEmployees.slice(0, 3));

//   return {
//     allDates,
//     employeeList: sortedEmployees, // sorted by OT hours
//     employeeMap,
//     dayTotals,
//     grandTotal,
//     topThree,
//   };
// };

const roundForDisplay = (num) => num.toFixed(1); // Display rounding to 1 decimal

export const transformOTMonthlySummary = (data) => {
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

  return {
    allDates,
    employeeList: sortedEmployees, // Sorted by OT hours
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
