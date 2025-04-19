import { getEmployeeOvertimeRecords } from "@/lib/mongodb/otQueries";

import CriteriaSelector from "@/app/components/CriteriaSelector";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import EmployeeOtRecords from "@/app/components/EmployeeOtRecords";

const MonthlyReportPage = async ({ searchParams }) => {
  const { start, end, name } = await searchParams;
  const { Employee } = await getOtSettings();
  const employeeOptions = Employee.map((item) => item.Name);

  const result = await getEmployeeOvertimeRecords(start, end, name);

  return (
    <>
      <CriteriaSelector
        employeeOptions={employeeOptions}
        start={start}
        end={end}
        name={name}
      />
      {result.length > 0 ? (
        <EmployeeOtRecords data={result} start={start} end={end} />
      ) : (
        <p className="text-center text-gray-600 mt-4">No record found!</p>
      )}
    </>
  );
};

export default MonthlyReportPage;
