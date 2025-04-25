import BillingCreate from "@/app/components/BillingCreate";

import BillingMonthSelector from "@/app/components/BillingMonthSelector";
import BillingView from "@/app/components/BillingView";

import { getBillByMonth } from "@/lib/mongodb/billQueries";
import { getEmployeesOtHours } from "@/lib/mongodb/otQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";
import BillingEdit from "@/app/components/BillingEdit";

function isValidMonth(input) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(input);
}

const BillingPage = async ({ searchParams, params }) => {
  const { month, mode } = await searchParams;
  const { dept } = await params;

  if (month && isValidMonth(month)) {
    const bill = await getBillByMonth(month, dept);

    if (bill) {
      if (mode && mode === "edit") {
        const date = getMonthStartAndEnd(month);

        const res = await getEmployeesOtHours(date.start, date.end, dept);

        const { Employee } = await getOtSettings(dept);

        return (
          <div>
            <BillingMonthSelector dept={dept} initMonth={month} />
            <BillingEdit
              empMonthlyData={bill}
              employees={Employee}
              totalOtRecords={res}
              month={month}
              dept={dept}
            />
          </div>
        );
      }

      return (
        <div>
          <BillingMonthSelector dept={dept} initMonth={month} />
          <BillingView data={bill} dept={dept} />
        </div>
      );
    }

    const date = getMonthStartAndEnd(month);

    const empHours = await getEmployeesOtHours(date.start, date.end, dept);

    if (empHours.length === 0) {
      return (
        <div>
          <BillingMonthSelector dept={dept} initMonth={month} />
          <p className="text-center my-8 text-xl">
            No OT records available for this month!
          </p>
        </div>
      );
    }

    const { Employee } = await getOtSettings(dept);

    return (
      <div>
        <BillingMonthSelector dept={dept} initMonth={month} />
        <BillingCreate
          employees={Employee}
          totalOtRecords={empHours}
          month={month}
          dept={dept}
        />
      </div>
    );
  }

  return (
    <div>
      <BillingMonthSelector dept={dept} initMonth={month} />
    </div>
  );
};

export default BillingPage;
