"use client";
import { useState } from "react";

import UserForm from "./UserForm";
import FormModal from "../FormModal";
import { createUser, updateUser } from "@/app/actions/userActions";
import { useRouter } from "next/navigation";
import FormStatus from "../FormStatus";
import { Pencil } from "lucide-react";

export default function UserBtn({ initData, depts, roles, isEditing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState({});

  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
    setStatus({});
  };
  const closeModal = () => setIsModalOpen(false);

  const handleUserSubmit = async (formData) => {
    const res = await createUser(formData);

    if (res.success) {
      setStatus(res);
      router.refresh();
      closeModal();
      return;
    }

    setStatus(res);
  };
  const handleEditUser = async (formData) => {
    const res = await updateUser(formData);

    if (res.success) {
      setStatus(res);
      router.refresh();
      closeModal();
      return;
    }

    setStatus(res);
  };

  return (
    <>
      {isEditing ? (
        <button
          onClick={openModal}
          className="flex items-center gap-1 text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-xl shadow"
        >
          <Pencil size={16} />
          Edit
        </button>
      ) : (
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Add User
        </button>
      )}

      <div className="text-left">
        <FormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Create User"
        >
          <UserForm
            isEditing={isEditing}
            initData={initData}
            depts={depts}
            roles={roles}
            onSubmit={isEditing ? handleEditUser : handleUserSubmit}
          />
          <div className="pb-4 px-4 text-center">
            <FormStatus state={status} />
          </div>
        </FormModal>
      </div>
    </>
  );
}
