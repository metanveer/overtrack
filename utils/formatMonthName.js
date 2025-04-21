export default function formatMonthName(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);

  const date = new Date(year, month - 1); // JS months are 0-indexed

  const formatted = date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return formatted;
}

export function formatMonthNameFromRange(startDateStr, endDateStr) {
  const [year, month] = startDateStr.split("-").map(Number);

  const date = new Date(year, month - 1); // JS months are 0-indexed

  return date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}
