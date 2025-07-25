import { OVERTIME_COLLECTION } from "./db";
export async function getOtByWorkDescription(query, dept) {
  if (!query) return [];

  const regex = new RegExp(query, "i"); // case-insensitive partial match
  const results = await OVERTIME_COLLECTION.find({
    Dept: dept,
    WorkDescription: { $regex: regex },
  })
    .sort({ Date: -1 }) // Sort by Date descending (latest first)
    .limit(10)
    .toArray();

  return results;
}
