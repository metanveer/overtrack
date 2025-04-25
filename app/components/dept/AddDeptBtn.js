"use client";
import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal";
import { addDept } from "@/app/actions/deptActions";
import FormStatus from "../FormStatus";
import { useRouter } from "next/navigation";

const AddDeptBtn = () => {
  const [modalShown, setModalShown] = useState(false);
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState({});
  const router = useRouter();
  const inputRef = useRef(null); // Create a ref for the input field

  useEffect(() => {
    // Focus the input field when the modal opens
    if (modalShown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalShown]); // Runs when modalShown changes

  async function handleAddDept() {
    const res = await addDept(dept);
    if (res.success) {
      setStatus(res);
      router.refresh();
      setDept("");
      setModalShown(false);
      return;
    }
    setStatus(res);
  }

  return (
    <>
      {modalShown ? (
        <Modal
          title="Add Department"
          onClose={() => {
            setModalShown(false);
            setStatus({});
          }}
          onConfirm={handleAddDept}
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
      ) : null}
      <button
        onClick={() => setModalShown(true)}
        className="px-4 py-2 mb-10  bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Department
      </button>
    </>
  );
};

export default AddDeptBtn;
