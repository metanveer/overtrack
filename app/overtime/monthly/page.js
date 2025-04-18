import { getDateWiseOtEntries } from "@/lib/mongodb/otQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";
import MonthSelector from "@/app/components/MonthSelector";
import MonthlySummary from "@/app/components/MonthlySummary";

const MonthlyReportPage = async ({ searchParams }) => {
  const { month, type } = await searchParams;

  if (!month) {
    return (
      <div className="p-2">
        <MonthSelector initMonth={month} />
      </div>
    );
  }

  const result = await getDateWiseOtEntries(month);

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

  return (
    <div className="p-2">
      <MonthSelector initMonth={month} />
      {type === "summary" ? (
        <MonthlySummary data={result} month={month} />
      ) : (
        <OtReportMonthly groupedData={result} monthString={month} />
      )}
    </div>
  );
};

export default MonthlyReportPage;
