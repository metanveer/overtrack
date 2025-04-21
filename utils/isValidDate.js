export default function isValidDate(dateStr) {
  // Check if the string matches YYYY-MM-DD with leading zeros
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateStr)) return false;

  // Check if it's an actual valid calendar date
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(dateStr);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
