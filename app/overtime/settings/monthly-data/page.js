import EmployeeMonthlyData from "@/app/components/EmployeeMonthlyData";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import React from "react";

const MonthlyDataPage = async () => {
  const { Employee } = await getOtSettings();

  return <EmployeeMonthlyData employeeList={Employee} />;
};
export default MonthlyDataPage;
