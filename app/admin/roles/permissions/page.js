import PermissionsManager from "@/app/components/role/PermissionsManager";
import { getAllDepts } from "@/lib/mongodb/deptQueries";
import { getRoleByName } from "@/lib/mongodb/roleQueries";

import { permissionsData } from "@/utils/permissions";

const EditPermPage = async ({ searchParams }) => {
  const { role } = await searchParams;

  const initRole = await getRoleByName(role);

  const depts = await getAllDepts();

  const deptPermNames = depts.map((item) => `DEPARTMENT__${item.deptName}`);

  const permData = [...permissionsData, ...deptPermNames];

  return (
    <div>
      <PermissionsManager permissionsData={permData} initRole={initRole} />
    </div>
  );
};

export default EditPermPage;
