import YearSelector from "@/app/components/YearSelector";
import YearView from "@/app/components/YearView";
import { getYearlyBilledOt } from "@/lib/mongodb/billQueries";
import { getYearlyActualOt } from "@/lib/mongodb/otQueries";

const YearlyReportPage = async ({ params, searchParams }) => {
  const { dept } = await params;
  const { year, type } = await searchParams;

  const actualYearlyOt = await getYearlyActualOt(dept, year);

  const billedYearlyOt = await getYearlyBilledOt(dept, year);
  const data = type === "billed" ? billedYearlyOt : actualYearlyOt;

  return (
    <div>
      <YearSelector dept={dept} year={year} reportType={type} />
      <YearView billData={data} reportType={type} year={year} dept={dept} />
    </div>
  );
};

export default YearlyReportPage;
