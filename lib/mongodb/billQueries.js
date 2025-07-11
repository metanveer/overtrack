import { BILL_COLLECTION } from "./db";

export async function insertBill(data) {
  const result = await BILL_COLLECTION.insertOne(data);

  return result;
}
export async function getBillByMonth(month, dept) {
  // Receive month in format YYYY-MM
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

export async function updateBill(billMonth, billData, dept) {
  const filter = { billMonth: billMonth, dept: dept };
  const update = { $set: { billData: billData } };

  const result = await BILL_COLLECTION.updateOne(filter, update);
  return result;
}

export async function getYearlyBilledOt(dept, year) {
  const monthlyBilledOt = await BILL_COLLECTION.aggregate([
    // 1. Filter by department and year
    {
      $match: {
        dept,
        billMonth: { $regex: `^${year}-` },
      },
    },

    // 2. Unwind billData array
    { $unwind: "$billData" },

    // 3. Project relevant fields
    {
      $project: {
        name: "$billData.name",
        billMonth: 1,
        bill: {
          $cond: {
            if: { $isNumber: "$billData.bill" },
            then: "$billData.bill",
            else: { $toDouble: "$billData.bill" }, // to handle strings like "288" or "074"
          },
        },
      },
    },

    // 4. Group by employee + billMonth to aggregate bill value
    {
      $group: {
        _id: {
          name: "$name",
          month: "$billMonth",
        },
        totalBill: { $sum: "$bill" },
      },
    },

    // 5. Group by employee name to reshape into months
    {
      $group: {
        _id: "$_id.name",
        bills: {
          $push: {
            month: "$_id.month",
            value: "$totalBill",
          },
        },
        yearlyTotal: { $sum: "$totalBill" },
      },
    },

    // 6. Map each month by code
    {
      $project: {
        _id: 0,
        name: "$_id",
        yearlyTotal: 1,
        january: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "01"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        february: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "02"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        march: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "03"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        april: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "04"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        may: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "05"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        june: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "06"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        july: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "07"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        august: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "08"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        september: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "09"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        october: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "10"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        november: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "11"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
        december: {
          $let: {
            vars: {
              val: {
                $first: {
                  $filter: {
                    input: "$bills",
                    as: "b",
                    cond: { $eq: [{ $substr: ["$$b.month", 5, 2] }, "12"] },
                  },
                },
              },
            },
            in: "$$val.value",
          },
        },
      },
    },

    // 7. Sort by yearly total bill descending
    { $sort: { yearlyTotal: -1 } },
  ]).toArray();

  return monthlyBilledOt;
}
