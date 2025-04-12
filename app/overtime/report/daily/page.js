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
import SelectDate from "@/app/components/SelectDate";

const DailyReportPage = async ({ searchParams }) => {
  const { date } = await searchParams;

  if (!date) {
    return (
      <div className="p-2">
        <h1 className="flex items-center text-xl font-bold mb-4 space-x-2 text-gray-800">
          <Link
            href="/overtime/report"
            className="text-blue-600 hover:underline"
          >
            Daily Reports
          </Link>
          <ChevronRight className="w-5 h-5 text-gray-500" />
          <span>{`Choose date`}</span>
        </h1>
        <SelectDate />
      </div>
    );
  }

  const records = await getOtEntriesByDate(date);

  return (
    <div className="p-2">
      <h1 className="flex items-center text-xl font-bold mb-4 space-x-2 text-gray-800">
        <Link
          href="/overtime/report/daily"
          className="text-blue-600 hover:underline"
        >
          Daily Reports
        </Link>
        <ChevronRight className="w-5 h-5 text-gray-500" />
        <span>{`Report dated ${formatDate(date)}`}</span>
      </h1>
      <OtReportDaily records={records} />
    </div>
  );
};

export default DailyReportPage;
