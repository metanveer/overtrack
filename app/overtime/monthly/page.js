import { getMonthlyOvertimes } from "@/lib/mongodb/otQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";
import MonthSelector from "@/app/components/MonthSelector";
import MonthlySummary from "@/app/components/MonthlySummary";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";

const MonthlyReportPage = async ({ searchParams }) => {
  const { month, type } = await searchParams;

  if (!month) {
    return (
      <div className="p-0">
        <MonthSelector initMonth={month} />
      </div>
    );
  }

  const result = await getMonthlyOvertimes(month);

  if (result.length === 0) {
    return (
      <div className="p-0">
        <MonthSelector initMonth={month} />
        <div className="text-center py-8 text-xl">
          No overtime data available!
        </div>
      </div>
    );
  }

  const { Employee } = await getOtSettings();

  const employeeOrder = Employee.map((item) => item.Name);

  const { start, end } = getMonthStartAndEnd(month);

  return (
    <div className="p-0">
      <MonthSelector initMonth={month} />
      {type === "summary" ? (
        <MonthlySummary
          data={result}
          month={month}
          employeeOrder={employeeOrder}
        />
      ) : (
        <OtReportMonthly start={start} end={end} groupedData={result} />
      )}
    </div>
  );
};

export default MonthlyReportPage;
