import { getFilteredOtByUnitAndDateRange } from "@/lib/mongodb/otQueries";

import CriteriaSelector from "@/app/components/CriteriaSelector";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

import OtReportMonthly from "@/app/components/OtReportMonthly";

const UnitOtPage = async ({ searchParams, params }) => {
  const { start, end, name } = await searchParams;
  const { dept } = await params;
  const { Unit } = await getOtSettings(dept);
  const unitOptions = Unit.map((item) => item);

  const result = await getFilteredOtByUnitAndDateRange(start, end, name, dept);

  return (
    <>
      <CriteriaSelector
        employeeOptions={unitOptions}
        start={start}
        end={end}
        name={name}
        isUnit
        dept={dept}
      />
      {result.length > 0 ? (
        <OtReportMonthly
          unitName={name}
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

export default UnitOtPage;
