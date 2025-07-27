// frontend/src/components/ModalConfirmDelete.jsx
import React from "react";
import { FiAlertTriangle } from "react-icons/fi"; // Tambahkan ikon

const ModalConfirmDelete = ({ itemName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Hapus</h2>
        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus <strong>{itemName}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
            Batal
          </button>
          <button onClick={onConfirm} className="text-sm px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
