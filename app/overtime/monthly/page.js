import { getMonthlyOvertimes } from "@/lib/mongodb/otQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";
import MonthSelector from "@/app/components/MonthSelector";
import MonthlySummary from "@/app/components/MonthlySummary";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

const MonthlyReportPage = async ({ searchParams }) => {
  const { month, type } = await searchParams;

  if (!month) {
    return (
      <div className="p-2">
        <MonthSelector initMonth={month} />
      </div>
    );
  }

  const result = await getMonthlyOvertimes(month);

  console.log("monthly ot", JSON.stringify(result, null, 2));

  if (result.length === 0) {
    return (
      <div className="p-2">
        <MonthSelector initMonth={month} />
        <div className="text-center py-8 text-xl">
          No overtime data available!
        </div>
      </div>
    );
  }

  const { Employee } = await getOtSettings();

  const employeeOrder = Employee.map((item) => item.Name);

  return (
    <div className="p-2">
      <MonthSelector initMonth={month} />
      {type === "summary" ? (
        <MonthlySummary
          data={result}
          month={month}
          employeeOrder={employeeOrder}
        />
      ) : (
        <OtReportMonthly groupedData={result} monthString={month} />
      )}
    </div>
  );
};

export default MonthlyReportPage;
