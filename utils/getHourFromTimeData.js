export default function getHourFromTimeData(timeString, OtTime) {
  const match = OtTime.find((item) => item.Time === timeString);
  return match ? match.Hour : null;
}
