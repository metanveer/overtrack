import { OT_SETTINGS_COLLECTION } from "./db";

export async function saveOtSettingsToDb(cleanedData) {
  const { _id, ...dataWithouId } = cleanedData;
  const result = await OT_SETTINGS_COLLECTION.replaceOne(
    { _id: _id },
    { _id: _id, ...dataWithouId },
    { upsert: true }
  );

  return result;
}

export async function getOtSettings(dept) {
  const result = await OT_SETTINGS_COLLECTION.findOne({ _id: dept });

  return result || {};
}
