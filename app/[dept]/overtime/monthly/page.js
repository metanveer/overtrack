import { getMonthlyOvertimes } from "@/lib/mongodb/otQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";
import MonthSelector from "@/app/components/MonthSelector";
import MonthlySummary from "@/app/components/MonthlySummary";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";

const MonthlyReportPage = async ({ searchParams, params }) => {
  const { month, type } = await searchParams;
  const { dept } = await params;

  if (!month) {
    return (
      <div className="p-0">
        <MonthSelector dept={dept} initMonth={month} />
      </div>
    );
  }

  const result = await getMonthlyOvertimes(month, dept);

  if (result.length === 0) {
    return (
      <div className="p-0">
        <MonthSelector dept={dept} initMonth={month} />
        <div className="text-center py-8 text-xl">
          No overtime data available!
        </div>
      </div>
    );
  }

  const { Employee } = await getOtSettings(dept);

  const employeeOrder = Employee.map((item) => item.Name);

  const { start, end } = getMonthStartAndEnd(month);

  return (
    <div className="p-0">
      <MonthSelector dept={dept} initMonth={month} />
      {type === "summary" ? (
        <MonthlySummary
          data={result}
          month={month}
          employeeOrder={employeeOrder}
        />
      ) : (
        <OtReportMonthly
          dept={dept}
          start={start}
          end={end}
          groupedData={result}
        />
      )}
    </div>
  );
};

export default MonthlyReportPage;
