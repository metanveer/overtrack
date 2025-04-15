"use client";
import { Delete } from "lucide-react";
import Modal from "./Modal";
import { deleteOtEntry } from "../actions/otActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormStatus from "./FormStatus";

const DeleteBtnConfirm = ({ currentId }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState({});
  const router = useRouter();

  async function handleDelete() {
    setStatus({ success: true, message: "Deleting entry..." });
    const res = await deleteOtEntry(currentId);
    if (res.success) {
      setStatus({ success: true, message: "Deleted successfully" });
      router.refresh();
      setSelectedId(null);
    }
    setStatus({ success: false, message: "Failed to delete!" });
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
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <Delete />
      </button>
    </>
  );
};

export default DeleteBtnConfirm;
