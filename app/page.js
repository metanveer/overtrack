import { BILL_COLLECTION, OVERTIME_COLLECTION } from "@/lib/mongodb/db";
import DashboardStats from "./components/DashboardStats";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

export default async function HomePage() {
  const totalOtEntries = await OVERTIME_COLLECTION.countDocuments();
  const totalBills = await BILL_COLLECTION.countDocuments();
  const { Employee } = await getOtSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
        INSTRUMENT WEB APP
      </h1>
      <DashboardStats
        totalOTEntries={totalOtEntries}
        totalBills={totalBills}
        totalEmployees={Employee?.length || 0}
      />
    </div>
  );
}
