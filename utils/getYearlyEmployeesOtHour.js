import { getEmployeeOvertimeRecords } from "@/lib/mongodb/otQueries";
import round1 from "@/utils/round1";
// Function to check leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Generate year-wise overtime data
export default async function getYearlyEmployeesOtHour(year, employees, dept) {
  const billData = [];

  const months = [
    { name: "january", start: `${year}-01-01`, end: `${year}-01-31` },
    {
      name: "february",
      start: `${year}-02-01`,
      end: isLeapYear(year) ? `${year}-02-29` : `${year}-02-28`,
    },
    { name: "march", start: `${year}-03-01`, end: `${year}-03-31` },
    { name: "april", start: `${year}-04-01`, end: `${year}-04-30` },
    { name: "may", start: `${year}-05-01`, end: `${year}-05-31` },
    { name: "june", start: `${year}-06-01`, end: `${year}-06-30` },
    { name: "july", start: `${year}-07-01`, end: `${year}-07-31` },
    { name: "august", start: `${year}-08-01`, end: `${year}-08-31` },
    { name: "september", start: `${year}-09-01`, end: `${year}-09-30` },
    { name: "october", start: `${year}-10-01`, end: `${year}-10-31` },
    { name: "november", start: `${year}-11-01`, end: `${year}-11-30` },
    { name: "december", start: `${year}-12-01`, end: `${year}-12-31` },
  ];

  for (const employee of employees) {
    const monthlyOt = { name: employee.Name };

    // Fetch all months in parallel for each employee
    const otPromises = months.map((month) =>
      getEmployeeOvertimeRecords(month.start, month.end, employee.Name, dept)
    );

    const results = await Promise.all(otPromises);

    months.forEach((month, index) => {
      monthlyOt[month.name] = round1(results[index][0]?.TotalOtHour);
    });

    billData.push(monthlyOt);
  }

  return billData;
}
