import React from "react";
import { createPortal } from "react-dom";
import Loading from "./Loading";

export default function ConfirmModal({
  loading,
  open,
  onClose,
  onConfirm,
  message,
}) {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      data-modal-overlay
      onClick={handleOverlayClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white p-6 rounded-xl shadow-xl w-[300px]"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold text-lg mb-3">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          {!loading && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </>
          )}
          {loading && <Loading />}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
