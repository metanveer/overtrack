import DailyReport from "@/app/components/OtReport";
import OtReportDaily from "@/app/components/OtReportDaily";
import {
  getDateWiseOtEntries,
  getOtEntriesByDate,
} from "@/lib/mongodb/otQueries";
import formatDate from "@/utils/formatDate";

import Link from "next/link";

import React from "react";
import { ChevronRight } from "lucide-react";
import OtReport from "@/app/components/OtReport";
import OtReportMonthly from "@/app/components/OtReportMonthly";
import MonthSelector from "@/app/components/MonthSelector";
import MonthlySummary from "@/app/components/MonthlySummary";

const MonthlyReportPage = async ({ searchParams }) => {
  const { month, type } = await searchParams;

  if (!month) {
    return (
      <div className="p-2">
        <MonthSelector />
      </div>
    );
  }

  const result = await getDateWiseOtEntries(month);

  console.log("Result", result);

  if (result.length === 0) {
    return (
      <div className="p-2">
        <MonthSelector />
        <div className="text-center py-8 text-xl">
          No overtime data available!
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <MonthSelector />
      {type === "summary" ? (
        <MonthlySummary data={result} />
      ) : (
        <OtReportMonthly groupedData={result} />
      )}
    </div>
  );
};

export default MonthlyReportPage;
