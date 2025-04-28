import { auth } from "@/auth";
import LayoutShell from "./LayoutShell"; // client layout
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

export const metadata = {
  title: "Overtime Track",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children, params }) {
  const { dept } = await params;

  const { Employee, Unit, OtType, OtTime } = await getOtSettings(dept);

  const session = await auth();

  return (
    <LayoutShell
      otTypes={OtType}
      otHours={OtTime}
      units={Unit}
      employees={Employee}
      dept={dept}
      session={session}
    >
      {children}
    </LayoutShell>
  );
}
