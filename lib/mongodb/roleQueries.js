"use server";
import { ObjectId } from "mongodb";
import { ROLES_COLLECTION } from "./db";

export async function getRoleByName(roleName) {
  const res = await ROLES_COLLECTION.findOne({ roleName: roleName });

  if (!res) {
    return null;
  }

  const result = {
    ...res,
    _id: res._id.toString(),
  };
  return result;
}
export async function getAllRoles() {
  const cursor = await ROLES_COLLECTION.find().toArray();

  const result = cursor.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return result || [];
}

export async function insertRole(role) {
  const res = await ROLES_COLLECTION.insertOne(role);

  return res;
}

export async function renameRoleById(id, roleName) {
  const _id = new ObjectId(id);

  const filter = { _id: _id };
  const update = { $set: { roleName } };

  const result = await ROLES_COLLECTION.updateOne(filter, update);
  return result;
}

export async function deleteRoleByName(roleName) {
  const res = await ROLES_COLLECTION.deleteOne({ roleName: roleName });

  return res;
}

export async function updatePermByRoleName(roleName, permissions) {
  const res = await ROLES_COLLECTION.updateOne(
    { roleName: roleName },
    { $set: { permissions } }
  );
  return res;
}
