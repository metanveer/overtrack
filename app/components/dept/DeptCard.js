"use client";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Modal from "../Modal";
import { deleteDept, editDept } from "@/app/actions/deptActions";
import { useRouter } from "next/navigation";
import FormStatus from "../FormStatus";
import { useEffect, useRef, useState } from "react";

export default function DeptCard({ id, deptName, href }) {
  const [activeCard, setActiveCard] = useState(null);
  const [status, setStatus] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dept, setDept] = useState(deptName);
  const router = useRouter();
  const inputRef = useRef(null); // Create a ref for the input field

  useEffect(() => {
    // Focus the input field when the modal opens
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]); // Runs when modalShown changes

  async function handleDelete() {
    const res = await deleteDept(id);
    if (res.success) {
      setStatus(res);
      router.refresh();
      setIsDeleting(false);

      setActiveCard(null);

      return;
    }
    setStatus(res);
  }
  async function handleEdit() {
    const res = await editDept(id, dept);
    if (res.success) {
      setStatus(res);
      router.refresh();
      setIsEditing(false);

      setActiveCard(null);

      return;
    }
    setStatus(res);
  }

  return (
    <>
      {activeCard === id && isEditing && (
        <Modal
          title={"Rename Department"}
          onClose={() => {
            setActiveCard(null);
            setIsEditing(false);
            setStatus({});
          }}
          onConfirm={handleEdit}
        >
          <input
            type="text"
            ref={inputRef} // Attach the ref here
            className="border-2 border-blue-300 p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dept}
            placeholder={`Department Name like "Instrument"`}
            onChange={(e) => setDept(e.target.value)}
          />
          <FormStatus state={status} />
        </Modal>
      )}
      {activeCard === id && isDeleting && (
        <Modal
          title={"Delete Department"}
          onClose={() => {
            setActiveCard(null);
            setIsDeleting(false);
            setStatus({});
          }}
          onConfirm={handleDelete}
        >
          <div className="text-2xl font-bold text-red-600">
            Are you sure you want to delete?
          </div>
          <div className="text-red-800  border border-amber-100 bg-amber-100 rounded-2xl py-4 px-4 text-center my-2 text-sm">
            This action will permanently delete all the overtime data associated
            with this department and cannot be reverted.
          </div>

          <FormStatus state={status} />
        </Modal>
      )}
      <div className="border border-white bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition-shadow">
        <Link
          href={href}
          className="text-xl font-bold not-last:text-blue-600 hover:text-blue-800"
        >
          <h2>{deptName}</h2>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveCard(id);
              setIsEditing(true);
            }}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => {
              setActiveCard(id);
              setIsDeleting(true);
            }}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
