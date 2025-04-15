import { BILL_COLLECTION } from "./db";

export async function insertBill(data) {
  const result = await BILL_COLLECTION.insertOne(data);

  return result;
}
export async function getBillByMonth(month) {
  const result = await BILL_COLLECTION.findOne({ billMonth: month });
  console.log("result", result);
  return result;
}

export async function updateBill(month, updateData) {
  const result = await BILL_COLLECTION.updateOne(
    { billMonth: month },
    { $set: updateData }
  );

  return result;
}
