import OtView from "@/app/components/OtView";
import { getOtById } from "@/lib/mongodb/otQueries";
import { notFound } from "next/navigation";
import React from "react";

const OtViewPage = async ({ searchParams }) => {
  const { id } = await searchParams;

  const data = await getOtById(id);

  if (!data) return notFound();

  return (
    <div>
      <OtView data={data} />
    </div>
  );
};

export default OtViewPage;
