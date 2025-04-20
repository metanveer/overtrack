import OvertimeForm from "@/app/components/OvertimeForm";
import { getOtById } from "@/lib/mongodb/otQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

import { notFound } from "next/navigation";

export default async function Page({ searchParams }) {
  const { id } = await searchParams;

  if (!id) return notFound();

  const overtimeDoc = await getOtById(id);

  const { OtType, Unit, Employee, OtTime } = await getOtSettings();

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
      />
    </div>
  );
}
