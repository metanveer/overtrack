import CustomLink from "@/app/components/CustomLink";
import { adminOptions } from "./admin-options";
import AccessDenied from "../components/auth/AccessDenied";

const AdminPage = async () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminOptions.map((item) => (
          <CustomLink key={item.href} href={item.href} label={item.label} />
        ))}
        <AccessDenied />
      </div>
    </>
  );
};

export default AdminPage;
