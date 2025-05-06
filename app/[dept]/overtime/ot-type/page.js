import { getFilteredOtByTypeAndDateRange } from "@/lib/mongodb/otQueries";

import CriteriaSelector from "@/app/components/CriteriaSelector";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";

import AccessDenied from "@/app/components/auth/AccessDenied";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";

const OtTypePage = async ({ searchParams, params }) => {
  const authCheck = await checkAuthPermission(perm.VIEW_OT_TYPE_REPORT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const { start, end, name } = await searchParams;
  const { dept } = await params;
  const { OtType } = await getOtSettings(dept);
  const otTypeOptions = OtType.map((item) => item);

  const result = await getFilteredOtByTypeAndDateRange(start, end, name, dept);

  return (
    <>
      <CriteriaSelector
        employeeOptions={otTypeOptions}
        start={start}
        end={end}
        name={name}
        isOtType
        dept={dept}
      />
      {result.length > 0 ? (
        <OtReportMonthly
          otType={name}
          start={start}
          end={end}
          groupedData={result}
          dept={dept}
        />
      ) : (
        <p className="text-center text-gray-600 mt-4">No record found!</p>
      )}
    </>
  );
};

export default OtTypePage;
