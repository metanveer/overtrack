import Billing from "@/app/components/Billing";
import BillingMonthSelector from "@/app/components/BillingMonthSelector";
import { getEmployeesOtHours } from "@/lib/mongodb/otQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";
import React from "react";

const CreateBillPage = async ({ searchParams }) => {
  const { month } = await searchParams;

  if (!month) {
    return (
      <div>
        <BillingMonthSelector />
      </div>
    );
  }

  const date = getMonthStartAndEnd(month);

  const res = await getEmployeesOtHours(date.start, date.end);

  const { Employee } = await getOtSettings();

  return (
    <div>
      <Billing employees={Employee} totalOtRecords={res} month={month} />
    </div>
  );
};

export default CreateBillPage;
