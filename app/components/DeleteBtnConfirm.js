"use client";
import { Delete, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormStatus from "./FormStatus";

const DeleteBtnConfirm = ({ currentId, deleteAction, dept }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState({});
  const router = useRouter();

  async function handleDelete() {
    setStatus({ success: true, message: "Deleting entry..." });
    const res = await deleteAction(currentId, dept);
    if (res.success) {
      setStatus({ success: true, message: "Deleted successfully" });
      router.refresh();
      setSelectedId(null);
    } else {
      setStatus({ success: false, message: "Failed to delete!" });
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
          <FormStatus state={status} />
        </Modal>
      )}
      <button
        onClick={() => {
          setSelectedId(currentId);
          setStatus({});
        }}
        className="flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-xl shadow"
      >
        <Trash2 size={16} />
        Delete
      </button>
    </>
  );
};

export default DeleteBtnConfirm;
