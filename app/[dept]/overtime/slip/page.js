import OtView from "@/app/components/OtView";
import { getOtById } from "@/lib/mongodb/otQueries";
import { notFound } from "next/navigation";
import React from "react";

const OtViewPage = async ({ searchParams, params }) => {
  const { id } = await searchParams;
  const { dept } = await params;

  const data = await getOtById(id);

  if (!data) return notFound();

  return (
    <div>
      <OtView dept={dept} data={data} />
    </div>
  );
};

export default OtViewPage;
