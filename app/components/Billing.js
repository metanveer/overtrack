"use client";

import React, {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createBill } from "../actions/billActions";
import FormStatus from "./FormStatus";
import { usePathname } from "next/navigation";
import formatMonthName from "@/utils/formatMonthName";

const Billing = ({ employees, totalOtRecords, month }) => {
  const initializeRows = useCallback(() => {
    return employees.map((emp) => {
      const ot =
        totalOtRecords.find((r) => r.name === emp.Name)?.totalOtHour || 0;
      return {
        name: emp.Name,
        designation: emp.Designation,
        basic: Number(emp.BasicSalary),
        totalOt: ot,
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
      key === "triple" || key === "bill" ? Number(val) || 0 : val;
    setRows(updated);
  };

  const getDouble = (row) => row.totalOt - (Number(row.triple) || 0);
  const getDiff = (row) => (Number(row.bill) || 0) - row.totalOt;
  const getPayment = (row) => {
    const bill = Number(row.bill) || 0;
    const triple = Number(row.triple) || 0;
    return (row.basic / 104) * (bill + triple / 2) || 0;
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.totalOt += row.totalOt;
        acc.bill += Number(row.bill) || 0;
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
      month: month,
    }));

    const dataToSave = {
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
          {`(Please insert employees' monthly claimed OT hours and triple value for preparing bill.)`}
        </div>
      </div>

      <div className="overflow-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-center bg-white">
          <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3 text-left">Employee</th>
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
                    i % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50 hover:bg-slate-100 transition-colors"
                  }
                >
                  <td className="p-3 font-medium text-slate-700">{i + 1}</td>
                  <td className="p-3 text-left">{row.name}</td>
                  <td className="p-3 text-left">{row.designation}</td>
                  <td className="p-3">{double}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={row.triple}
                      onChange={(e) =>
                        handleChange(i, "triple", e.target.valueAsNumber)
                      }
                      className="w-20 text-center border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3">{row.totalOt}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={row.bill}
                      onChange={(e) =>
                        handleChange(i, "bill", e.target.valueAsNumber)
                      }
                      className="w-20 text-center border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3">{diff}</td>
                  <td className="p-3">{row.basic.toLocaleString()}</td>
                  <td className="p-3">
                    {Number(payment).toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) =>
                        handleChange(i, "remarks", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </td>
                </tr>
              );
            })}

            <tr className="bg-blue-50 font-semibold text-slate-700">
              <td colSpan={5} className="p-3 text-right">
                Total
              </td>
              <td className="p-3">
                {Number(totals.totalOt).toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </td>
              <td className="p-3">{totals.bill}</td>
              <td className="p-3"></td>
              <td className="p-3"></td>
              <td className="p-3">
                {Number(totals.payment).toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </td>
              <td className="p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isPending ? (
        <div className="text-blue-600 font-semibold mt-4">
          Saving bill data...
        </div>
      ) : state ? (
        <FormStatus state={state} />
      ) : null}

      <div className="mt-6 text-right">
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Billing;
