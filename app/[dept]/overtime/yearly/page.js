import YearSelector from "@/app/components/YearSelector";
import YearView from "@/app/components/YearView";
import { getBillsByYear } from "@/lib/mongodb/billQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getYearlyEmployeesBilledOtHour from "@/utils/getYearlyEmployeesBilledOtHour";
import getYearlyEmployeesOtHour from "@/utils/getYearlyEmployeesOtHour";

const YearlyReportPage = async ({ params, searchParams }) => {
  const { dept } = params;
  const { year, type } = searchParams;

  const { Employee } = await getOtSettings(dept);

  const actualYearlyOt = await getYearlyEmployeesOtHour(year, Employee, dept);

  const monthlyData = await getBillsByYear(year, dept);

  const billedYearlyOt = getYearlyEmployeesBilledOtHour(monthlyData);
  const data = type === "billed" ? billedYearlyOt : actualYearlyOt;

  return (
    <div>
      <YearSelector dept={dept} year={year} />
      <YearView billData={data} reportType={type} year={year} dept={dept} />
    </div>
  );
};

export default YearlyReportPage;
