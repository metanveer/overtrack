"use client";

import Link from "next/link";
import Modal from "../Modal";

import { useRouter } from "next/navigation";
import FormStatus from "../FormStatus";
import { useEffect, useRef, useState } from "react";
import { deleteRole } from "@/app/actions/roleActions";

export default function RoleCard({ id, roleName }) {
  const [activeCard, setActiveCard] = useState(null);
  const [status, setStatus] = useState({});

  const router = useRouter();
  const inputRef = useRef(null); // Create a ref for the input field

  useEffect(() => {
    // Focus the input field when the modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Runs when modalShown changes

  async function handleDelete() {
    const res = await deleteRole(roleName);
    if (res.success) {
      setStatus(res);
      router.refresh();

      setActiveCard(null);

      return;
    }
    setStatus(res);
  }

  return (
    <>
      {activeCard === id && (
        <Modal
          title={"Delete Role"}
          onClose={() => {
            setActiveCard(null);

            setStatus({});
          }}
          onConfirm={handleDelete}
        >
          <div className="text-2xl font-bold text-red-600">
            Are you sure you want to delete?
          </div>
          <div className="text-red-800  border border-amber-100 bg-amber-100 rounded-2xl py-4 px-4 text-center my-2 text-sm">
            This action will permanently delete all associated permissions and
            cannot be reverted.
          </div>

          <FormStatus state={status} />
        </Modal>
      )}
      <div className="max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md border border-blue-100">
        <h2 className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">
          Role
        </h2>
        <div className="text-2xl font-bold text-gray-800 mb-6">{roleName}</div>
        <div className="flex gap-4">
          <Link
            href={`/admin/roles/permissions?role=${roleName}`}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition"
          >
            Edit Permission
          </Link>
          <button
            onClick={() => {
              setActiveCard(id);
            }}
            className="flex-1 px-4 py-2 text-sm font-semibold text-blue-500 border border-blue-500 hover:bg-blue-50 rounded-xl transition"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
