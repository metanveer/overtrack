import BillingView from "@/app/components/BillingView";
import { getBillByMonth } from "@/lib/mongodb/billQueries";

const ViewBillPage = async ({ searchParams }) => {
  const { month } = await searchParams;

  const bill = await getBillByMonth(month);

  return <BillingView data={bill} />;
};

export default ViewBillPage;
