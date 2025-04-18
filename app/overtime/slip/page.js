import OtView from "@/app/components/OtView";
import { getOtById } from "@/lib/mongodb/otQueries";
import React from "react";

const OtViewPage = async ({ searchParams }) => {
  const { id } = await searchParams;

  const data = await getOtById(id);

  return (
    <div>
      <OtView data={data} />
    </div>
  );
};

export default OtViewPage;
