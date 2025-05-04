import { ObjectId } from "mongodb";
import { OVERTIME_COLLECTION } from "./db";
import { getOtSettings } from "./oTSettingsQueries";

export async function insertOt(data) {
  const result = await OVERTIME_COLLECTION.insertOne(data);
  return result;
}

export async function checkDuplicateOtEntry(data) {
  const { Date, Type, Unit, WorkDescription, Remarks, Dept, Employee } = data;

  function normalizeUnit(unitArray) {
    return [...unitArray].sort(); // sort alphabetically
  }

  function normalizeEmployeeArray(empArray) {
    return empArray
      .map((emp) => ({
        Name: emp.Name,
        OtTime: emp.OtTime,
        OtHour: emp.OtHour,
      }))
      .sort((a, b) => a.Name.localeCompare(b.Name)); // sort by Name for consistency
  }

  function areEmployeesEqual(a, b) {
    if (a.length !== b.length) return false;
    const normA = normalizeEmployeeArray(a);
    const normB = normalizeEmployeeArray(b);
    return normA.every(
      (emp, i) =>
        emp.Name === normB[i].Name &&
        emp.OtTime === normB[i].OtTime &&
        emp.OtHour === normB[i].OtHour
    );
  }

  const sortedUnit = normalizeUnit(Unit);

  const candidates = await OVERTIME_COLLECTION.find({
    Date,
    Type,
    WorkDescription,
    Remarks,
    Dept,
  }).toArray();

  for (const candidate of candidates) {
    if (!Array.isArray(candidate.Unit) || !Array.isArray(candidate.Employee))
      continue;

    const candidateSortedUnit = normalizeUnit(candidate.Unit);
    if (JSON.stringify(candidateSortedUnit) !== JSON.stringify(sortedUnit))
      continue;

    if (areEmployeesEqual(candidate.Employee, Employee)) {
      return true;
    }
  }

  return false;
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

export async function getDailyOvertimes(selectedDate, dept) {
  try {
    // Step 1: Get employee order from OT_SETTINGS
    const settings = await getOtSettings(dept);
    const employeeOrder = settings.Employee.map((emp) => emp.Name);

    // Step 2: Fetch daily overtime entries
    const cursor = OVERTIME_COLLECTION.aggregate([
      {
        $match: {
          Date: selectedDate,
          Dept: dept,
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

    const result = await cursor.toArray();
    const records = result.length > 0 ? result[0].records : [];

    // Step 3: Sort Employees array inside each record
    const recordsWithSortedEmployees = records.map((record) => {
      const sortedEmployees = record.Employees.sort((a, b) => {
        return employeeOrder.indexOf(a.Name) - employeeOrder.indexOf(b.Name);
      });
      return { ...record, Employees: sortedEmployees };
    });

    // Step 4: Sort records based on first employee in sorted Employees array
    const fullySortedRecords = recordsWithSortedEmployees.sort((a, b) => {
      const aFirst = a.Employees[0]?.Name;
      const bFirst = b.Employees[0]?.Name;
      return employeeOrder.indexOf(aFirst) - employeeOrder.indexOf(bFirst);
    });

    return fullySortedRecords;
  } catch (error) {
    console.error("Error fetching overtime entries by date:", error);
    throw new Error("Failed to fetch overtime entries.");
  }
}

export async function getMonthlyOvertimes(month, dept) {
  // Step 1: Get employee order from OT_SETTINGS
  const { Employee = [] } = (await getOtSettings(dept)) || {};
  const employeeOrder = Employee.map((emp) => emp.Name);

  // Step 2: Run aggregation query
  const result = await OVERTIME_COLLECTION.aggregate([
    {
      $match: {
        Date: { $regex: `^${month}` }, // e.g., "2025-01"
        Dept: dept,
      },
    },
    {
      $addFields: {
        totalOtForEntry: {
          $sum: {
            $map: {
              input: "$Employee",
              as: "e",
              in: { $toDouble: "$$e.OtHour" },
            },
          },
        },
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
            Employee: "$Employee",
            Remarks: "$Remarks",
          },
        },
        totalOtHours: { $sum: "$totalOtForEntry" },
      },
    },
    {
      $addFields: {
        totalOtHours: {
          $ceil: { $multiply: ["$totalOtHours", 10] },
        },
      },
    },
    {
      $addFields: {
        totalOtHours: { $divide: ["$totalOtHours", 10] },
      },
    },
    { $sort: { _id: 1 } },
  ]).toArray();

  // Step 3: Sort employees and records in JS
  const sortedResult = result.map((entry) => {
    const recordsWithSortedEmployees = entry.records.map((record) => {
      const sortedEmployees = record.Employee.sort((a, b) => {
        return employeeOrder.indexOf(a.Name) - employeeOrder.indexOf(b.Name);
      });
      return { ...record, Employee: sortedEmployees };
    });

    const sortedRecords = recordsWithSortedEmployees.sort((a, b) => {
      const aFirst = a.Employee[0]?.Name;
      const bFirst = b.Employee[0]?.Name;
      return employeeOrder.indexOf(aFirst) - employeeOrder.indexOf(bFirst);
    });

    return {
      ...entry,
      records: sortedRecords,
    };
  });

  return sortedResult;
}

export async function getEmployeeOvertimeRecords(
  startDate,
  endDate,
  employeeName,
  dept
) {
  const pipeline = [
    {
      $match: {
        Date: { $gte: startDate, $lte: endDate },
        Dept: dept,
        Employee: {
          $elemMatch: { Name: employeeName },
        },
      },
    },
    // Store the original _id before unwinding
    {
      $addFields: { originalDocId: "$_id" },
    },
    { $unwind: "$Employee" },
    { $match: { "Employee.Name": employeeName } },
    {
      $group: {
        _id: {
          name: "$Employee.Name",
          type: "$Type",
        },
        OtHour: {
          $sum: { $toDouble: "$Employee.OtHour" },
        },
        Entries: {
          $push: {
            _id: { $toString: "$originalDocId" }, // 🔁 Convert ObjectId to string
            Date: "$Date",
            OtHour: "$Employee.OtHour",
            OtTime: "$Employee.OtTime",
            Unit: "$Unit",
            WorkDescription: "$WorkDescription",
            Remarks: "$Remarks",
            Type: "$Type",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.name",
        TotalOtHourByType: {
          $push: {
            Type: "$_id.type",
            TotalOtHour: "$OtHour",
          },
        },
        TotalOtHour: { $sum: "$OtHour" },
        Entries: {
          $push: "$Entries",
        },
      },
    },
    {
      $project: {
        _id: 0,
        Employee: "$_id",
        TotalOtHourByType: 1,
        TotalOtHour: 1,
        Entries: {
          $reduce: {
            input: "$Entries",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] },
          },
        },
      },
    },
    {
      $project: {
        Employee: 1,
        TotalOtHourByType: 1,
        TotalOtHour: 1,
        OT: {
          $sortArray: {
            input: "$Entries",
            sortBy: { Date: 1 }, // ascending order
          },
        },
      },
    },
  ];

  const result = await OVERTIME_COLLECTION.aggregate(pipeline).toArray();
  return result;
}

export async function getEmployeesOtHours(startDate, endDate, dept) {
  const result = await OVERTIME_COLLECTION.aggregate([
    {
      $match: {
        Date: { $gte: startDate, $lte: endDate },
        Dept: dept,
      },
    },
    {
      $unwind: "$Employee",
    },
    {
      $group: {
        _id: "$Employee.Name",
        totalOtHour: {
          $sum: {
            $toDouble: "$Employee.OtHour",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        totalOtHour: { $round: ["$totalOtHour", 1] },
      },
    },
    {
      $sort: { name: 1 },
    },
  ]).toArray();

  return result;
}

export async function getFilteredOtByUnitAndDateRange(
  startDate,
  endDate,
  unitName,
  dept
) {
  // Step 1: Get employee order from OT_SETTINGS
  const settings = await getOtSettings(dept);
  const employeeOrder = settings.Employee.map((emp) => emp.Name);

  // Step 2: Run aggregation query
  const result = await OVERTIME_COLLECTION.aggregate([
    {
      $match: {
        Date: { $gte: startDate, $lte: endDate },
        Dept: dept,
        Unit: unitName,
      },
    },
    {
      $addFields: {
        totalOtForEntry: {
          $sum: {
            $map: {
              input: "$Employee",
              as: "e",
              in: { $toDouble: "$$e.OtHour" },
            },
          },
        },
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
            Employee: "$Employee",
            Remarks: "$Remarks",
          },
        },
        totalOtHours: { $sum: "$totalOtForEntry" },
      },
    },
    {
      $addFields: {
        totalOtHours: {
          $ceil: { $multiply: ["$totalOtHours", 10] },
        },
      },
    },
    {
      $addFields: {
        totalOtHours: { $divide: ["$totalOtHours", 10] },
      },
    },
    { $sort: { _id: 1 } },
  ]).toArray();

  // Step 3: Sort employees and records in JS
  const sortedResult = result.map((entry) => {
    const recordsWithSortedEmployees = entry.records.map((record) => {
      const sortedEmployees = record.Employee.sort((a, b) => {
        return employeeOrder.indexOf(a.Name) - employeeOrder.indexOf(b.Name);
      });
      return { ...record, Employee: sortedEmployees };
    });

    const sortedRecords = recordsWithSortedEmployees.sort((a, b) => {
      const aFirst = a.Employee[0]?.Name;
      const bFirst = b.Employee[0]?.Name;
      return employeeOrder.indexOf(aFirst) - employeeOrder.indexOf(bFirst);
    });

    return {
      ...entry,
      records: sortedRecords,
    };
  });

  return sortedResult;
}
export async function getFilteredOtByTypeAndDateRange(
  startDate,
  endDate,
  otType,
  dept
) {
  // Step 1: Get employee order from OT_SETTINGS
  const settings = await getOtSettings(dept);
  const employeeOrder = settings.Employee.map((emp) => emp.Name);

  // Step 2: Run aggregation query
  const result = await OVERTIME_COLLECTION.aggregate([
    {
      $match: {
        Date: { $gte: startDate, $lte: endDate },
        Dept: dept,
        Type: otType,
      },
    },
    {
      $addFields: {
        totalOtForEntry: {
          $sum: {
            $map: {
              input: "$Employee",
              as: "e",
              in: { $toDouble: "$$e.OtHour" },
            },
          },
        },
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
            Employee: "$Employee",
            Remarks: "$Remarks",
          },
        },
        totalOtHours: { $sum: "$totalOtForEntry" },
      },
    },
    {
      $addFields: {
        totalOtHours: {
          $ceil: { $multiply: ["$totalOtHours", 10] },
        },
      },
    },
    {
      $addFields: {
        totalOtHours: { $divide: ["$totalOtHours", 10] },
      },
    },
    { $sort: { _id: 1 } },
  ]).toArray();

  // Step 3: Sort employees and records in JS
  const sortedResult = result.map((entry) => {
    const recordsWithSortedEmployees = entry.records.map((record) => {
      const sortedEmployees = record.Employee.sort((a, b) => {
        return employeeOrder.indexOf(a.Name) - employeeOrder.indexOf(b.Name);
      });
      return { ...record, Employee: sortedEmployees };
    });

    const sortedRecords = recordsWithSortedEmployees.sort((a, b) => {
      const aFirst = a.Employee[0]?.Name;
      const bFirst = b.Employee[0]?.Name;
      return employeeOrder.indexOf(aFirst) - employeeOrder.indexOf(bFirst);
    });

    return {
      ...entry,
      records: sortedRecords,
    };
  });

  return sortedResult;
}
