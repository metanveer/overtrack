import OvertimeForm from "@/app/components/OvertimeForm";
import { getOtById } from "@/lib/mongodb/otQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

import { notFound } from "next/navigation";

export default async function Page({ searchParams, params }) {
  const { id } = await searchParams;
  const { dept } = await params;

  if (!id) return notFound();

  const overtimeDoc = await getOtById(id);

  if (!overtimeDoc) return notFound();

  const { OtType, Unit, Employee, OtTime } = await getOtSettings(dept);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4 space-x-2 text-blue-600 text-center">
        {`Update Overtime`}
      </h1>
      <OvertimeForm
        typeOptions={OtType}
        unitOptions={Unit}
        nameOptions={Employee}
        otTimeOptions={OtTime}
        isEditing
        overtimeDoc={overtimeDoc}
        deptName={dept}
      />
    </div>
  );
}
