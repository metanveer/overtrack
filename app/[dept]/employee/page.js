import { getEmployeeOvertimeRecords } from "@/lib/mongodb/otQueries";

import CriteriaSelector from "@/app/components/CriteriaSelector";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import EmployeeOtRecords from "@/app/components/EmployeeOtRecords";
import AccessDenied from "@/app/components/auth/AccessDenied";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";

const MonthlyReportPage = async ({ searchParams, params }) => {
  const authCheck = await checkAuthPermission(perm.VIEW_EMPLOYEE_REPORT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }
  const { start, end, name } = await searchParams;
  const { dept } = await params;
  const { Employee } = await getOtSettings(dept);
  const employeeOptions = Employee.map((item) => item.Name);

  const result = await getEmployeeOvertimeRecords(start, end, name, dept);

  return (
    <>
      <CriteriaSelector
        employeeOptions={employeeOptions}
        start={start}
        end={end}
        name={name}
        dept={dept}
      />
      {result.length > 0 ? (
        <EmployeeOtRecords data={result} start={start} end={end} dept={dept} />
      ) : (
        <p className="text-center text-gray-600 mt-4">No record found!</p>
      )}
    </>
  );
};

export default MonthlyReportPage;
