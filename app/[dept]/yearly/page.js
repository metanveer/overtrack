import AccessDenied from "@/app/components/auth/AccessDenied";
import YearSelector from "@/app/components/YearSelector";
import YearView from "@/app/components/YearView";
import { getYearlyBilledOt } from "@/lib/mongodb/billQueries";
import { getYearlyActualOt } from "@/lib/mongodb/otQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";

const YearlyReportPage = async ({ params, searchParams }) => {
  const authCheck = await checkAuthPermission(perm.VIEW_YEARLY_REPORT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const { dept } = await params;
  const { year, type } = await searchParams;

  const actualYearlyOt = await getYearlyActualOt(dept, year);

  const billedYearlyOt = await getYearlyBilledOt(dept, year);
  const data = type === "billed" ? billedYearlyOt : actualYearlyOt;

  const isEmpty = data.length === 0;

  return (
    <>
      <YearSelector dept={dept} year={year} reportType={type} />

      {isEmpty ? (
        <div className="text-center py-8 text-xl text-gray-500 font-semibold">
          No overtime data available for {year}!
        </div>
      ) : (
        <YearView billData={data} reportType={type} year={year} dept={dept} />
      )}
    </>
  );
};

export default YearlyReportPage;
