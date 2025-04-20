import React from "react";

export default function LoginAlert({ setShowModal, handleLogin }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 m-4">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Login Required
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please log in to share your story with the doctor.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="cursor-pointer px-4 py-2 rounded-md bg-[#6b45c6] hover:bg-[#5938b0] text-white text-sm"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
