import { MongoClient } from "mongodb";

const databaseName = process.env.DB_NAME || "ERL-INSTRUMENT-DB";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

client = await clientPromise;
export const db = client.db(databaseName);
export const OVERTIME_COLLECTION = db.collection("OVERTIME");
export const BILL_COLLECTION = db.collection("BILL");
export const OT_SETTINGS_COLLECTION = db.collection("OT_SETTINGS");
export const DEPT_COLLECTION = db.collection("DEPTS");
export const USERS_COLLECTION = db.collection("USERS");
export const ROLES_COLLECTION = db.collection("ROLES");

export default clientPromise;

export { client };
