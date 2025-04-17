import OtReportDaily from "@/app/components/OtReportDaily";
import { getOtEntriesByDate } from "@/lib/mongodb/otQueries";
import formatDate from "@/utils/formatDate";

import React from "react";

import SelectDate from "@/app/components/SelectDate";

const DailyReportPage = async ({ searchParams }) => {
  const { date } = await searchParams;

  if (!date) {
    return (
      <div className="p-2">
        <SelectDate />
      </div>
    );
  }

  const records = await getOtEntriesByDate(date);

  return (
    <div className="p-2">
      <SelectDate />

      {records.length === 0 ? (
        <div className="text-center text-xl py-12">No daily records found!</div>
      ) : (
        <>
          <h1 className="flex items-center text-xl font-bold mb-4 mt-6 space-x-2 text-gray-800">
            <span>{`Report dated ${formatDate(date)}`}</span>
          </h1>
          <OtReportDaily records={records} date={date} />
        </>
      )}
    </div>
  );
};

export default DailyReportPage;
