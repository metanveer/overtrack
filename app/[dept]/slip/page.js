import AccessDenied from "@/app/components/auth/AccessDenied";
import OtView from "@/app/components/OtView";
import { getOtById } from "@/lib/mongodb/otQueries";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";
import { notFound } from "next/navigation";
import React from "react";

const OtViewPage = async ({ searchParams, params }) => {
  const authCheck = await checkAuthPermission(perm.VIEW_OT);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

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
