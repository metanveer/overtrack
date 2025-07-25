"use server";

import { getOtByWorkDescription } from "@/lib/mongodb/searchQueries";

export async function searchByWorkDescription(query, dept) {
  if (!query) return [];

  const results = await getOtByWorkDescription(query, dept);

  return results.map((doc) => ({
    _id: doc._id.toString(),
    Date: doc.Date,
    Type: doc.Type,
    Unit: doc.Unit,
    WorkDescription: doc.WorkDescription,
    Dept: doc.Dept,
    Employee: doc.Employee,
    Remarks: doc.Remarks,
  }));
}
