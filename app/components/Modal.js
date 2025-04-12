"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ title, onClose, onConfirm, children }) => {
  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 relative p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* Modal Content */}
        <div className="mb-6">{children}</div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
