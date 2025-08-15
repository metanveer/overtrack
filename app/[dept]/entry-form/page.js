import OvertimeForm from "@/app/components/OvertimeForm";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import { redirect } from "next/navigation";
import AccessDenied from "@/app/components/auth/AccessDenied";
import checkAuthPermission from "@/utils/checkAuthPermission";
import { perm } from "@/utils/permissions";

export default async function Page({ params }) {
  const authCheck = await checkAuthPermission(perm.OT_ADD);

  if (!authCheck.success) {
    return <AccessDenied />;
  }

  const { dept } = await params;
  const { OtType, Unit, Employee, OtTime } = await getOtSettings(dept);

  if (!Employee || !Unit || !OtType || !OtTime) redirect(`/${dept}/settings`);

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
        deptName={dept}
      />
    </div>
  );
}
