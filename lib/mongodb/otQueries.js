import { ObjectId } from "mongodb";
import { OVERTIME_COLLECTION } from "./db";

export async function insertOt(data) {
  const result = await OVERTIME_COLLECTION.insertOne(data);
  return result;
}

export async function checkDuplicateOtEntry(data) {
  const { Date, Type, Unit, WorkDescription, Remarks } = data;
  const duplicate = await OVERTIME_COLLECTION.findOne({
    Date,
    Type,
    Unit,
    WorkDescription,
    Remarks,
  });
  return !!duplicate;
}

export async function getAllOtEntry() {
  const result = await OVERTIME_COLLECTION.find({}).toArray();

  return result.map((entry) => ({
    ...entry,
    _id: entry._id.toString(),
  }));
}

export async function getOtById(id) {
  const mongoId = new ObjectId(id);
  const resultRaw = await OVERTIME_COLLECTION.findOne({ _id: mongoId });

  if (!resultRaw) return null;

  const result = {
    ...resultRaw,
    _id: resultRaw._id.toString(),
  };

  return result;
}

export async function updateOtById(parsedData) {
  // Remove _id from data so it is not updated.
  const { _id, ...dataWithoutId } = parsedData;
  const filter = { _id: new ObjectId(_id) };
  const update = { $set: dataWithoutId };

  const result = await OVERTIME_COLLECTION.updateOne(filter, update);

  return result;
}

export async function getDateWiseOtEntries() {
  const result = await OVERTIME_COLLECTION.aggregate([
    {
      $group: {
        _id: "$Date",
        records: {
          $push: {
            _id: { $toString: "$_id" },
            Type: "$Type",
            Unit: "$Unit",
            WorkDescription: "$WorkDescription",
            Employee: "$Employee",
            Remarks: "$Remarks",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]).toArray();

  return result;
}

export async function getOtEntriesByDate(selectedDate) {
  try {
    const cursor = OVERTIME_COLLECTION.aggregate([
      {
        $match: {
          Date: selectedDate,
        },
      },
      {
        $group: {
          _id: "$Date",
          records: {
            $push: {
              _id: { $toString: "$_id" },
              Type: "$Type",
              Unit: "$Unit",
              WorkDescription: "$WorkDescription",
              Employees: "$Employee",
              Remarks: "$Remarks",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          records: 1,
        },
      },
    ]);

    // Convert the cursor to an array and return the 'records' field
    const result = await cursor.toArray();

    return result.length > 0 ? result[0].records : [];
  } catch (error) {
    console.error("Error fetching overtime entries by date:", error);
    throw new Error("Failed to fetch overtime entries.");
  }
}
