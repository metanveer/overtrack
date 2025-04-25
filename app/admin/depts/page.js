import CustomLink from "@/app/components/CustomLink";
import React from "react";

import AddDeptBtn from "@/app/components/dept/AddDeptBtn";
import { getAllDepts } from "@/lib/mongodb/deptQueries";
import DeptCard from "@/app/components/dept/DeptCard";

async function DeptsPage() {
  const depts = await getAllDepts();

  return (
    <div className="text-center">
      <AddDeptBtn />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {depts.map((item) => (
          <DeptCard
            id={item._id}
            key={item.href}
            href={item.href}
            deptName={item.deptName}
          />
        ))}
      </div>
    </div>
  );
}

export default DeptsPage;
