export default function getPreviousMonth(input) {
  const [year, month] = input.split("-").map(Number);

  // Adjust year and month if we're in January
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  // Pad month with leading zero if necessary
  const formattedMonth = String(prevMonth).padStart(2, "0");

  return `${prevYear}-${formattedMonth}`;
}

// Example usage:
// console.log(getPreviousMonth("2025-01")); // Output: "2024-12"
// console.log(getPreviousMonth("2025-07")); // Output: "2025-06"
