import React from "react";

const BillingView = ({ data }) => {
  if (!data || !data.billData || data.billData.length === 0)
    return <div>No data available</div>;

  const month = new Date(data.billMonth + "-01").toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const totalTotalOt = data.billData.reduce(
    (sum, emp) => sum + (parseFloat(emp.totalOt) || 0),
    0
  );
  const totalBill = data.billData.reduce(
    (sum, emp) => sum + (parseFloat(emp.bill) || 0),
    0
  );
  const totalPayment = data.billData.reduce(
    (sum, emp) => sum + (parseFloat(emp.payment) || 0),
    0
  );

  return (
    <div className="p-0">
      <h2 className="text-2xl font-bold mb-4">Billing Month: {month}</h2>
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th className="px-4 py-2 uppercase">#</th>
              <th className="px-4 py-2 uppercase">Name</th>
              <th className="px-4 py-2 uppercase">Designation</th>
              <th className="px-4 py-2 uppercase">Double</th>
              <th className="px-4 py-2 uppercase">Triple</th>
              <th className="px-4 py-2 uppercase">Total HR.</th>
              <th className="px-4 py-2 uppercase">Bill HR.</th>
              <th className="px-4 py-2 uppercase">Diff</th>
              <th className="px-4 py-2 uppercase">Basic TK.</th>
              <th className="px-4 py-2 uppercase">Payment TK.</th>
              <th className="px-4 py-2 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {data.billData.map((emp, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.designation}</td>
                <td className="px-4 py-2">{emp.double}</td>
                <td className="px-4 py-2">{emp.triple}</td>
                <td className="px-4 py-2">{emp.totalOt}</td>
                <td className="px-4 py-2">{emp.bill}</td>
                <td className="px-4 py-2">{emp.difference}</td>
                <td className="px-4 py-2">{emp.basic.toLocaleString()}</td>
                <td className="px-4 py-2">
                  {emp.payment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-2">{emp.remarks}</td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-semibold">
              <td className="px-4 py-2 text-center" colSpan={4}>
                Totals
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">{totalTotalOt}</td>
              <td className="px-4 py-2">{totalBill.toLocaleString()}</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">
                {totalPayment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingView;
