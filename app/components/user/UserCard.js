import { Pencil, Trash2 } from "lucide-react";
import DeleteBtnConfirm from "../DeleteBtnConfirm";
import { deleteUser } from "@/app/actions/userActions";
import UserBtn from "./UserBtn";

const UserCard = ({ id, name, email, dept, role, depts, roles }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-sm p-6 w-full max-w-md hover:shadow-md transition">
      <div className="space-y-2">
        {name && (
          <h2 className="text-xl font-semibold text-blue-800">{name}</h2>
        )}
        <p className="text-blue-700 text-sm">
          <span className="font-medium">Email:</span> {email}
        </p>
        <p className="text-blue-700 text-sm">
          <span className="font-medium">Department:</span> {dept}
        </p>
        <p className="text-blue-700 text-sm">
          <span className="font-medium">Role:</span> {role}
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {/* <button
          // onClick={onEdit}
          className="flex items-center gap-1 text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-xl shadow"
        >
          <Pencil size={16} />
          Edit
        </button> */}

        <UserBtn
          isEditing
          initData={{ id, name, email, dept, role }}
          depts={depts}
          roles={roles}
        />

        <DeleteBtnConfirm currentId={id} deleteAction={deleteUser} dept={"_"} />
      </div>
    </div>
  );
};

export default UserCard;
