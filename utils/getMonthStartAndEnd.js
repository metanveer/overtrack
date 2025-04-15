export default function getMonthStartAndEnd(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0));

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  };
}

// Example:
//console.log(getMonthStartAndEnd("2025-01"));
// Output: { start: '2025-01-01', end: '2025-01-31' }
