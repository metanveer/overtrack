import OtReport from "@/app/components/OtReport";

import { getAllOtEntry } from "@/lib/mongodb/otQueries";
import React from "react";

const ReportPage = async () => {
  // const reports = [
  //   {
  //     Date: "2024-01-08",
  //     Type: "Exigency",
  //     Unit: "SCP",
  //     WorkDescription: "LCV 1305 Servicing",
  //     Remarks: "",
  //     Employee: [
  //       { Name: "MR. S M KAMRUL HASAN", OtTime: "17.00-02.00" },
  //       { Name: "MR. MD. MONIRUL HOQUE", OtTime: "17.00-02.00" },
  //     ],
  //   },
  // ];

  const reports = await getAllOtEntry();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Report</h1>
      <OtReport reports={reports} />
    </div>
  );
};

export default ReportPage;
