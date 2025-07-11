"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createBill, editBill } from "../actions/billActions";
import FormStatus from "./FormStatus";
import { useRouter } from "next/navigation";
import formatMonthName from "@/utils/formatMonthName";
import round1 from "@/utils/round1";
import TextLink from "./TextLink";

const BillingEdit = ({
  employees,
  totalOtRecords,
  month,
  empMonthlyData, // current month bill data {}
  prevBill, // previous month bill data {}
  dept,
  isNewBill,
}) => {
  const { billMonth, billData } = empMonthlyData || {};

  const initializedRows = useMemo(() => {
    return employees.map((emp) => {
      const ot =
        totalOtRecords.find((r) => r.name === emp.Name)?.totalOtHour || 0;

      const existing = billData?.find((b) => b.name === emp.Name);

      return {
        name: emp.Name,
        designation: emp.Designation,
        basic: Number(emp.BasicSalary),
        totalOt: round1(ot),
        triple: existing?.triple ?? 0,
        bill: isNewBill ? round1(ot) : existing?.bill ?? 0,
        remarks: existing?.remarks ?? "",
      };
    });
  }, [employees, totalOtRecords, billData, isNewBill]);

  const [rows, setRows] = useState(initializedRows);

  const actionFn = isNewBill ? createBill : editBill;
  const [state, formAction, isPending] = useActionState(actionFn, {});
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push(`/${dept}/overtime/billing?month=${billMonth}`);
    }
  }, [state, router, billMonth, dept]);

  const handleChange = (index, key, value) => {
    const updated = rows.map((r, idx) =>
      idx === index ? { ...r, [key]: value } : r
    );
    setRows(updated);
  };

  const getDouble = (row) => round1(row.totalOt - (Number(row.triple) || 0));
  const getDiff = (row) => round1((Number(row.bill) || 0) - row.totalOt);
  const getBalance = (row) => {
    const currentDiff = getDiff(row);
    const prev = prevBill?.billData?.find((p) => p.name === row.name);
    const prevBalance = prev?.balance ?? 0;

    return round1(-currentDiff + prevBalance);
  };

  const getPayment = (row) => {
    const bill = Number(row.bill) || 0;
    if (bill === 0) return 0;
    const triple = Number(row.triple) || 0;
    if (!row.basic) return 0;
    return round1((row.basic / 104) * (bill + triple / 2));
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
    const result = rows.map((row) => ({
      ...row,
      double: getDouble(row),
      difference: getDiff(row),
      balance: getBalance(row),
      payment: getPayment(row),
      month: month,
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
      <div className="mb-6 text-2xl font-bold text-blue-700 text-center">
        {`${isNewBill ? "Prepare" : "Edit"}`} Bill for {formatMonthName(month)}
      </div>

      <div className="overflow-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-center bg-white">
          <thead className="bg-blue-100 text-blue-700 text-xs tracking-wider">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3">Double</th>
              <th className="p-3">Triple</th>
              <th className="p-3">Total</th>
              <th className="p-3">Billed Hr.</th>
              <th className="p-3">Diff</th>
              <th className="p-3">Balance Hr.</th>
              <th className="p-3">Basic</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const double = getDouble(row);
              const diff = getDiff(row);
              const balance = getBalance(row);
              const payment = getPayment(row);

              return (
                <tr
                  key={row.name}
                  className={
                    i % 2 === 0
                      ? "bg-white hover:bg-blue-100 transition-colors"
                      : "bg-blue-50 hover:bg-blue-100 transition-colors"
                  }
                >
                  <td className="p-3 font-medium text-blue-700">{i + 1}</td>
                  <td className="p-3 text-left">{row.name}</td>
                  <td className="p-3 text-left">{row.designation}</td>
                  <td className="p-3">{double}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={row.triple}
                      onChange={(e) =>
                        handleChange(i, "triple", e.target.value)
                      }
                      className="w-20 text-center border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3">{row.totalOt}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={row.bill}
                      onChange={(e) => handleChange(i, "bill", e.target.value)}
                      className="w-20 text-center border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </td>
                  <td className="p-3">{diff}</td>
                  <td className="p-3">{balance}</td>
                  <td className="p-3">{row.basic.toLocaleString()}</td>
                  <td className="p-3">
                    {Number(payment).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
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
              <td className="p-3">{round1(totals.totalOt)}</td>
              <td className="p-3">{round1(totals.bill)}</td>
              <td className="p-3"></td>
              <td className="p-3"></td>
              <td className="p-3"></td>
              <td className="p-3">
                {Number(totals.payment).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className="p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isPending ? (
        <p className="mt-4 text-blue-600">Sending data...</p>
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
          href={`/${dept}/overtime/billing?month=${month}`}
        />
      </div>
    </form>
  );
};

export default BillingEdit;
