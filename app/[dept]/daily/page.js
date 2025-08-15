import OtReportDaily from "@/app/components/OtReportDaily";
import { getDailyOvertimes } from "@/lib/mongodb/otQueries";
import formatDate, { getDayName } from "@/utils/formatDate";

import SelectDate from "@/app/components/SelectDate";
import AccessDenied from "@/app/components/auth/AccessDenied";
import { perm } from "@/utils/permissions";
import checkAuthPermission from "@/utils/checkAuthPermission";

const DailyReportPage = async ({ searchParams, params }) => {
  const authCheck = await checkAuthPermission(perm.VIEW_DAILY_REPORT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const { date } = await searchParams;
  const { dept } = await params;

  if (!date) {
    return (
      <div className="p-2">
        <SelectDate />
      </div>
    );
  }

  const records = await getDailyOvertimes(date, dept);

  return (
    <div className="p-2">
      <SelectDate dept={dept} queryDate={date} />

      {records.length === 0 ? (
        <div className="text-center text-xl py-12">No daily records found!</div>
      ) : (
        <>
          <h1 className="flex items-center text-xl font-bold mb-4 mt-6 space-x-2 text-gray-800">
            <span>{`Report dated ${formatDate(date)} (${getDayName(
              date
            )})`}</span>
          </h1>
          <OtReportDaily dept={dept} records={records} date={date} />
        </>
      )}
    </div>
  );
};

export default DailyReportPage;
