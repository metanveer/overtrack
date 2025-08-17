export default function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

export function getDayName(
  dateStr,
  format = "YYYY-MM-DD",
  dayNameLength = "short"
) {
  let date;

  if (format === "YYYY-MM-DD") {
    date = new Date(dateStr);
  } else if (format === "DD-MM-YYYY") {
    const [day, month, year] = dateStr.split("-");
    date = new Date(`${year}-${month}-${day}`);
  } else if (format === "MM-DD-YYYY") {
    const [month, day, year] = dateStr.split("-");
    date = new Date(`${year}-${month}-${day}`);
  } else {
    throw new Error(
      "Unsupported format. Use YYYY-MM-DD, DD-MM-YYYY, or MM-DD-YYYY."
    );
  }

  return date
    .toLocaleDateString("en-US", { weekday: dayNameLength })
    .toUpperCase();
}
