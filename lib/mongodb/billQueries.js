import { BILL_COLLECTION } from "./db";

export async function insertBill(data) {
  const result = await BILL_COLLECTION.insertOne(data);

  return result;
}
export async function getBillByMonth(month, dept) {
  const res = await BILL_COLLECTION.findOne({ billMonth: month, dept: dept });

  if (!res) {
    return null;
  }

  const result = {
    ...res,
    _id: res._id.toString(),
  };
  return result;
}
export async function getBillsByYear(year, dept) {
  const query = {
    billMonth: { $regex: `^${year}` },
  };

  if (dept) {
    query.dept = dept;
  }

  const res = await BILL_COLLECTION.find(query).toArray();

  if (!res || res.length === 0) {
    return [];
  }

  const result = res.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
  }));

  return result;
}

export async function updateBill(billMonth, billData, dept) {
  const filter = { billMonth: billMonth, dept: dept };
  const update = { $set: { billData: billData } };

  const result = await BILL_COLLECTION.updateOne(filter, update);
  return result;
}
