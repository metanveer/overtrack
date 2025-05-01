import { BILL_COLLECTION, OVERTIME_COLLECTION } from "@/lib/mongodb/db";

import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import DashboardStats from "../components/DashboardStats";
import MonthlySummary from "../components/MonthlySummary";
import { getMonthlyOvertimes } from "@/lib/mongodb/otQueries";

export default async function DeptHomePage({ params }) {
  const { dept } = await params;
  const totalOtEntries = await OVERTIME_COLLECTION.countDocuments({
    Dept: dept,
  });
  const totalBills = await BILL_COLLECTION.countDocuments({ dept: dept });
  const { Employee } = await getOtSettings(dept);

  const currentDate = new Date();
  const yearMonth = currentDate.toISOString().slice(0, 7);

  console.log("uear month", yearMonth);

  const month = yearMonth;

  const result = await getMonthlyOvertimes(month, dept);

  const employeeOrder = Employee.map((item) => item.Name);

  return (
    <div>
      <h1 className="text-3xl text-center font-bold text-blue-800 tracking-wide">
        {dept} Department
      </h1>
      <DashboardStats
        totalOTEntries={totalOtEntries}
        totalBills={totalBills}
        totalEmployees={Employee?.length || 0}
      />

      <MonthlySummary
        isDashboard
        data={result}
        month={month}
        employeeOrder={employeeOrder}
        dept={dept}
      />
    </div>
  );
}
