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

const MonthlyReportPage = async ({ searchParams }) => {
  const { date } = await searchParams;

  const result = await getDateWiseOtEntries();

  return (
    <div className="p-4">
      <h1 className="flex items-center text-xl font-bold mb-4 space-x-2 text-gray-800">
        <Link href="/overtime/report" className="text-blue-600 hover:underline">
          Reports
        </Link>
        <ChevronRight className="w-5 h-5 text-gray-500" />
        <span>{`Monthly Report`}</span>
      </h1>

      <OtReportMonthly groupedData={result} />
    </div>
  );
};

export default MonthlyReportPage;
