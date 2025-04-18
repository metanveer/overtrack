import OvertimeForm from "@/app/components/OvertimeForm";
import { getOtById } from "@/lib/mongodb/otQueries";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ searchParams }) {
  const { id } = await searchParams;

  if (!id) return notFound();

  const overtimeDoc = await getOtById(id);

  const { OtType, Unit, Employee, OtTime } = await getOtSettings();

  return (
    <div className="p-6">
      <h1 className="flex items-center text-xl font-bold mb-4 space-x-2 text-gray-800">
        <Link href="/overtime" className="text-blue-600 hover:underline">
          OT Entries
        </Link>
        <ChevronRight className="w-5 h-5 text-gray-500" />
        <span>{`Edit Overtime Entry`}</span>
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
