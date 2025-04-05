import React from "react";

export default function CustomPagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <div className="flex justify-center mt-6 mb-6 gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-lg font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
