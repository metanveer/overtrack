import CustomLink from "@/app/components/CustomLink";
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";
import getNavLinks from "@/utils/getNavLinks";

const Settings = async ({ params }) => {
  const { dept } = await params;

  const { Employee, Unit, OtType, OtTime } = await getOtSettings(dept);

  const navLinks = getNavLinks(Employee, Unit, OtType, OtTime, dept);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navLinks
          .filter((item) => item.href !== `/${dept}/overtime`)
          .map((item) => (
            <CustomLink key={item.href} href={item.href} label={item.label} />
          ))}
      </div>
    </>
  );
};

export default Settings;
