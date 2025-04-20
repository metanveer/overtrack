import OvertimeForm from "@/app/components/OvertimeForm";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

export default async function Page() {
  const { OtType, Unit, Employee, OtTime } = await getOtSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4 space-x-2 text-blue-600 text-center">
        {`Add Overtime`}
      </h1>
      <OvertimeForm
        typeOptions={OtType}
        unitOptions={Unit}
        nameOptions={Employee}
        otTimeOptions={OtTime}
      />
    </div>
  );
}
