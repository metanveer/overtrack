import { OT_SETTINGS_COLLECTION } from "./db";

export async function saveOtSettingsToDb(cleanedData) {
  const result = await OT_SETTINGS_COLLECTION.replaceOne(
    { _id: "ot-settings" },
    { _id: "ot-settings", ...cleanedData },
    { upsert: true }
  );

  return result;
}

export async function getOtSettings() {
  const result = await OT_SETTINGS_COLLECTION.findOne(
    { _id: "ot-settings" },
    { projection: { _id: 0 } } // Excludes the _id field
  );

  return result;
}

export async function getHourFromOtTime(timeString) {
  const { OtTime } = await getOtSettings();
  const match = OtTime.find((item) => item.Time === timeString);
  return match ? match.Hour : null;
}
