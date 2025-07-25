"use server";
import { USERS_COLLECTION } from "./db";
import { ObjectId } from "mongodb";

export async function getAllUsers() {
  const users = await USERS_COLLECTION.find({}).toArray();
  return users.map((user) => ({ ...user, _id: user._id.toString() }));
}

export async function getUserById(id) {
  const user = await USERS_COLLECTION.findOne({ _id: new ObjectId(id) });
  if (user) {
    user._id = user._id.toString();
  }
  return user;
}

export async function getUserByEmail(email) {
  const user = await USERS_COLLECTION.findOne({ email });
  if (user) {
    user._id = user._id.toString();
  }
  return user;
}

export async function insertUser(user) {
  const result = await USERS_COLLECTION.insertOne(user);
  return result.insertedId.toString();
}

export async function updateUserById(id, updates) {
  const result = await USERS_COLLECTION.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

export async function deleteUserById(id) {
  const result = await USERS_COLLECTION.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
