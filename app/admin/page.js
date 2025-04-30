import CustomLink from "@/app/components/CustomLink";
import { adminOptions } from "./admin-options";
import checkAuthPermission from "@/utils/checkAuthPermission";

import { perm } from "@/utils/permissions";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const { success, session } = await checkAuthPermission(perm.VIEW_ADMIN_PAGE);
  if (success) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminOptions.map((item) => (
          <CustomLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
    );
  }

  redirect(`/`);
};

export default AdminPage;
