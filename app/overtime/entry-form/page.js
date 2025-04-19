import OvertimeForm from "@/app/components/OvertimeForm";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

export default async function Page() {
  const { OtType, Unit, Employee, OtTime } = await getOtSettings();

  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mb-4">Overtime Form</h1>
      <OvertimeForm
        typeOptions={OtType}
        unitOptions={Unit}
        nameOptions={Employee}
        otTimeOptions={OtTime}
      />
    </div>
  );
}
