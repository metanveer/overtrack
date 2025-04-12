"use client";
import { Delete } from "lucide-react";
import Modal from "./Modal";
import { deleteOtEntry } from "../actions/otActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteBtnConfirm = ({ currentId }) => {
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  async function handleDelete() {
    const res = await deleteOtEntry(currentId);
    if (res.success) {
      router.refresh();
      setSelectedId(null);
    }
  }

  return (
    <>
      {selectedId === currentId && (
        <Modal
          title={"Confirm Delete"}
          onClose={() => setSelectedId(null)}
          onConfirm={handleDelete}
        >
          Are you sure? This can not be undone!
        </Modal>
      )}
      <button
        onClick={() => {
          setSelectedId(currentId);
        }}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <Delete />
      </button>
    </>
  );
};

export default DeleteBtnConfirm;
