import Billing from "@/app/components/Billing";
import BillingMonthSelector from "@/app/components/BillingMonthSelector";
import BillingView from "@/app/components/BillingView";
import { getBillByMonth } from "@/lib/mongodb/billQueries";
import { getEmployeesOtHours } from "@/lib/mongodb/otQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";
import React from "react";

function isValidMonth(input) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(input);
}

const BillingPage = async ({ searchParams }) => {
  const { month } = await searchParams;

  if (month && isValidMonth(month)) {
    const bill = await getBillByMonth(month);

    console.log("bill", bill);

    if (bill) {
      return (
        <div>
          <BillingMonthSelector />
          <BillingView data={bill} />
        </div>
      );
    }

    const date = getMonthStartAndEnd(month);

    const res = await getEmployeesOtHours(date.start, date.end);

    const { Employee } = await getOtSettings();

    return (
      <div>
        <BillingMonthSelector />
        <Billing employees={Employee} totalOtRecords={res} month={month} />
      </div>
    );
  }

  return (
    <div>
      <BillingMonthSelector />
    </div>
  );
};

export default BillingPage;
