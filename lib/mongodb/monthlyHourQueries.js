import { MONTHLY_HR_COLLECTION } from "./db";

export async function insertMonthlyHr(data) {
  const result = await MONTHLY_HR_COLLECTION.insertOne(data);

  return result;
}
export async function getMonthlyHr({ month, year }) {
  const result = await MONTHLY_HR_COLLECTION.findOne({ month, year });

  return result;
}
