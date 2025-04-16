import { BILL_COLLECTION } from "./db";

export async function insertBill(data) {
  const result = await BILL_COLLECTION.insertOne(data);

  return result;
}
export async function getBillByMonth(month) {
  const res = await BILL_COLLECTION.findOne({ billMonth: month });

  if (!res) {
    return null;
  }

  const result = {
    ...res,
    _id: res._id.toString(),
  };
  return result
}

export async function updateBill(billMonth, billData) {

  const filter = { billMonth: billMonth };
  const update = { $set: { billData: billData } };

  const result = await BILL_COLLECTION.updateOne(
    filter,
    update
  )
  return result;
}


