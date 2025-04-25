import { BILL_COLLECTION, OVERTIME_COLLECTION } from "@/lib/mongodb/db";

import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import DashboardStats from "../components/DashboardStats";

export default async function DeptHomePage({ params }) {
  const totalOtEntries = await OVERTIME_COLLECTION.countDocuments();
  const totalBills = await BILL_COLLECTION.countDocuments();
  const { dept } = await params;
  const { Employee } = await getOtSettings(dept);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 tracking-wide">{dept}</h1>
      <DashboardStats
        totalOTEntries={totalOtEntries}
        totalBills={totalBills}
        totalEmployees={Employee?.length || 0}
      />
    </div>
  );
}
