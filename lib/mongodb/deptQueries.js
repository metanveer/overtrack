import { ObjectId } from "mongodb";
import { DEPT_COLLECTION } from "./db";

export async function getDeptByName(deptName) {
  const res = await DEPT_COLLECTION.findOne({ deptName: deptName });

  if (!res) {
    return null;
  }

  const result = {
    ...res,
    _id: res._id.toString(),
  };
  return result;
}
export async function getAllDepts() {
  const cursor = await DEPT_COLLECTION.find().toArray();

  const result = cursor.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return result;
}

export async function insertDept(dept) {
  const res = await DEPT_COLLECTION.insertOne(dept);

  return res;
}

export async function updateDept(id, dept) {
  const _id = new ObjectId(id);

  const filter = { _id: _id };
  const update = { $set: dept };

  const result = await DEPT_COLLECTION.updateOne(filter, update);
  return result;
}
