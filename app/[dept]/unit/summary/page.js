import {
  getFilteredOtByUnitAndDateRange,
  getUnitsOtSummary,
} from "@/lib/mongodb/otQueries";

import CriteriaSelector from "@/app/components/CriteriaSelector";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";

import AccessDenied from "@/app/components/auth/AccessDenied";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import UnitsSummaryTable from "@/app/components/UnitsSummaryTable";

const UnitSummaryPage = async ({ searchParams, params }) => {
  const authCheck = await checkAuthPermission(perm.VIEW_UNIT_REPORT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }
  const { start, end } = await searchParams;
  const { dept } = await params;
  const { Unit } = await getOtSettings(dept);
  const unitOptions = Unit.map((item) => item);

  const unitSummary = await getUnitsOtSummary(start, end, dept);

  return (
    <>
      <CriteriaSelector
        employeeOptions={unitOptions}
        start={start}
        end={end}
        isUnitsSummary
        dept={dept}
      />
      {unitSummary.length > 0 ? (
        <UnitsSummaryTable data={unitSummary} dept={dept} />
      ) : (
        <p className="text-center text-gray-600 mt-4">No record found!</p>
      )}
    </>
  );
};

export default UnitSummaryPage;
