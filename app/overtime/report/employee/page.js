import {
  getDateWiseOtEntries,
  getEmployeeOvertimeRecords,
} from "@/lib/mongodb/otQueries";
import formatDate from "@/utils/formatDate";

import Link from "next/link";

import React from "react";
import { ChevronRight } from "lucide-react";
import OtReport from "@/app/components/OtReport";
import OtReportMonthly from "@/app/components/OtReportMonthly";
import MonthSelector from "@/app/components/MonthSelector";
import CriteriaSelector from "@/app/components/CriteriaSelector";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import EmployeeOtRecords from "@/app/components/EmployeeOtRecords";

const MonthlyReportPage = async ({ searchParams }) => {
  const { start, end, name } = await searchParams;
  const { Employee } = await getOtSettings();
  const employeeOptions = Employee.map((item) => item.Name);

  const result = await getEmployeeOvertimeRecords(start, end, name);

  console.log("result of employee reocrd", JSON.stringify(result, null, 2));

  return (
    <>
      <CriteriaSelector employeeOptions={employeeOptions} />
      {result.length > 0 && <EmployeeOtRecords data={result} />}
    </>
  );
};

export default MonthlyReportPage;
