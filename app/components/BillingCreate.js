"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  startTransition,
  useActionState,
} from "react";
import { usePathname } from "next/navigation";
import { createBill } from "../actions/billActions";
import FormStatus from "./FormStatus";
import formatMonthName from "@/utils/formatMonthName";
import round1 from "@/utils/round1";
import TextLink from "./TextLink";

const BillingCreate = ({ employees, totalOtRecords, month, dept }) => {
  const initializeRows = useMemo(() => {
    return () =>
      employees.map((emp) => {
        const ot =
          totalOtRecords.find((r) => r.name === emp.Name)?.totalOtHour || 0;
        return {
          name: emp.Name,
          designation: emp.Designation,
          basic: Number(emp.BasicSalary),
          totalOt: round1(ot),
          triple: 0,
          bill: 0,
          remarks: "",
        };
      });
  }, [employees, totalOtRecords]);

  const [rows, setRows] = useState(initializeRows());
  const [state, formAction, isPending] = useActionState(createBill, {});
  const path = usePathname();

  useEffect(() => {
    setRows(initializeRows());
  }, [path, initializeRows]);

  const handleChange = (index, key, val) => {
    const updated = [...rows];
    updated[index][key] =
      key === "triple" || key === "bill" ? round1(val) || 0 : val;
    setRows(updated);
  };

  const getDouble = (row) => {
    return round1(row.totalOt - (Number(row.triple) || 0));
  };

  const getDiff = (row) => {
    return round1((Number(row.bill) || 0) - row.totalOt);
  };

  const getPayment = (row) => {
    const bill = Number(row.bill) || 0;
    if (bill === 0) return 0;
    const triple = Number(row.triple) || 0;
    const base = row.basic / 104;
    const total = bill + triple / 2;
    return round1(base * total);
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.totalOt += row.totalOt;
        acc.bill += row.bill || 0;
        acc.payment += getPayment(row);
        return acc;
      },
      { totalOt: 0, bill: 0, payment: 0 }
    );
  }, [rows]);

  const handleSave = (e) => {
    e.preventDefault();

    const hasInvalid = rows.some((row) => row.triple < 0 || row.bill < 0);
    if (hasInvalid) {
      alert("Triple or Bill values can't be negative.");
      return;
    }

    const result = rows.map((row) => ({
      ...row,
      double: getDouble(row),
      difference: getDiff(row),
      payment: getPayment(row),
      month,
    }));

    const dataToSave = {
      dept: dept,
      billMonth: month,
      billData: result,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataToSave));
    startTransition(() => formAction(formData));
  };

  return (
    <form className="py-6" onSubmit={handleSave}>
      <div className="mb-6 mt-4 text-center">
        <div className="text-2xl font-bold text-blue-700">
          Prepare Bill for {formatMonthName(month)}
        </div>
        <div className="text-gray-500">
          {`(Please insert employees' monthly claimed OT hours and triple value
          for preparing bill.)`}
        </div>
      </div>
      <div className="rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto rounded-lg  ">
          <table className="min-w-full text-sm text-center bg-white">
            <thead className="bg-blue-100 text-blue-700 text-xs uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3 w-48 text-left sticky left-0 bg-blue-100 z-20">
                  Employee
                </th>
                <th className="p-3 text-left">Designation</th>
                <th className="p-3">Double</th>
                <th className="p-3">Triple</th>
                <th className="p-3">Total</th>
                <th className="p-3">Bill</th>
                <th className="p-3">Diff</th>
                <th className="p-3">Basic</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const double = getDouble(row);
                const diff = getDiff(row);
                const payment = getPayment(row);

                return (
                  <tr
                    key={`${row.name}-${i}`}
                    className={
                      i % 2 === 0 ? "bg-white" : "bg-blue-50  transition-colors"
                    }
                  >
                    <td className="p-3 font-medium text-blue-700">{i + 1}</td>
                    <td
                      className={`p-3 w-48 text-left sticky left-0 z-10 ${
                        i % 2 === 0 ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      {row.name}
                    </td>

                    <td className="p-3 text-left">{row.designation}</td>
                    <td className="p-3">{double}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={row.triple}
                        onChange={(e) =>
                          handleChange(i, "triple", e.target.valueAsNumber)
                        }
                        className="w-20 text-center border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="p-3">{row.totalOt}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={row.bill}
                        onChange={(e) =>
                          handleChange(i, "bill", e.target.valueAsNumber)
                        }
                        className="w-20 text-center border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </td>
                    <td className="p-3">{diff}</td>
                    <td className="p-3">{row.basic.toLocaleString()}</td>
                    <td className="p-3">
                      {payment.toLocaleString(undefined, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </td>
                    <td className="p-3">
                      <textarea
                        value={row.remarks}
                        onChange={(e) =>
                          handleChange(i, "remarks", e.target.value)
                        }
                        className="w-full min-w-[200px] border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300 resize"
                        rows={3}
                      />
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-blue-50 font-semibold text-blue-700">
                <td colSpan={5} className="p-3 text-right">
                  Total
                </td>
                <td className="p-3">
                  {round1(totals.totalOt).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </td>
                <td className="p-3">
                  {round1(totals.bill).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3">
                  {round1(totals.payment).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </td>
                <td className="p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isPending ? (
        <div className="text-blue-600 font-semibold mt-4">
          Saving bill data...
        </div>
      ) : state ? (
        <FormStatus state={state} />
      ) : null}

      <div className="mt-6 flex gap-6">
        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-2  font-medium rounded-md shadow transition ${
            isPending
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <TextLink
          isButton
          btnClassName="px-6 py-2.5  font-medium rounded-md shadow transition
             bg-red-600 hover:bg-red-700 text-white"
          text="Close Editor"
          href={`/${dept}/overtime/billing`}
        />
      </div>
    </form>
  );
};

export default BillingCreate;
