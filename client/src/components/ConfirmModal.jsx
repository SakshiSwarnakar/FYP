import React from "react";
import Loading from "./Loading";

export default function ConfirmModal({ loading, open, onClose, onConfirm, message }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[300px]">
                <h2 className="font-semibold text-lg mb-3">Are you sure?</h2>
                <p className="text-sm text-gray-600 mb-5">{message}</p>

                <div className="flex justify-end gap-3">
                    {!loading && <><button
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
                        </button></>}
                    {loading && <Loading />}
                </div>
            </div>
        </div>
    );
}
