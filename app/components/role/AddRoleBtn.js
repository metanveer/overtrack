"use client";
import React, { useState, useEffect, useRef } from "react";
import Modal from "../Modal";
import FormStatus from "../FormStatus";
import { useRouter } from "next/navigation";
import { createRole } from "@/app/actions/roleActions";

const AddRoleBtn = () => {
  const [modalShown, setModalShown] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState({});
  const router = useRouter();
  const inputRef = useRef(null); // Create a ref for the input field

  useEffect(() => {
    // Focus the input field when the modal opens
    if (modalShown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalShown]); // Runs when modalShown changes

  async function handleAddRole() {
    const res = await createRole(roleName);
    if (res.success) {
      setStatus(res);
      router.refresh();
      setRoleName("");
      setModalShown(false);
      return;
    }
    setStatus(res);
  }

  return (
    <>
      {modalShown ? (
        <Modal
          title="Add Role"
          onClose={() => {
            setModalShown(false);
            setStatus({});
          }}
          onConfirm={handleAddRole}
        >
          <input
            type="text"
            ref={inputRef} // Attach the ref here
            className="border-2 border-blue-300 p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleName}
            placeholder={`Role name`}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <FormStatus state={status} />
        </Modal>
      ) : null}
      <button
        onClick={() => {
          setModalShown(true);
          setStatus({});
        }}
        className="px-4 py-2 mb-10  bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Role
      </button>
    </>
  );
};

export default AddRoleBtn;
