"use client";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-md mx-auto rounded-lg shadow-xl modal-responsive">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          🎉Bitte betstätige🎉
        </h2>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 text-sm rounded transition-colors duration-300"
          >
            Ja
          </button>
          <button
            onClick={onClose}
            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold text-sm py-2 px-4 rounded transition-colors duration-300"
          >
            Nein
          </button>
        </div>
      </div>
    </div>
  );
};
