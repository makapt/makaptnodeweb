"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import profileFactory from "@/actions/profileAction";
import { formatAppointmentDate } from "@/utils/helper";

export default function ProfilePage() {
  const router = useRouter();
  const [reviewList, setReviewList] = useState({ data: [], count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 12;

  const fetchData = async (page) => {
    const offset = page - 1;
    const result = await profileFactory.getUserOwnReview({
      limit: itemsPerPage,
      page: offset,
    });
    setReviewList(result.data);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(reviewList.count / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusStyles = {
      deleted: "bg-[rgba(255,44,0,0.1)] text-[#ff2c00]",
      reject: "bg-[rgba(255,44,0,0.1)] text-[#ff2c00]",
      active: "bg-[#28a745] text-[#fff]",
      inactive: "bg-[rgba(255,165,0,0.1)] text-[#ffa500]",
    };

    return (
      <span
        className={`px-2 py-1 rounded-sm text-[12px] ${
          statusStyles[status] || "bg-gray-200 text-gray-600"
        }`}
      >
        {status === "inactive"
          ? "UNDER MODERATION"
          : status === "deleted"
          ? "Deleted"
          : "Published"}
      </span>
    );
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    console.log("Delete member with ID:", deleteId);
    setDeleteId(null);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Total Review: {reviewList.count}
      </h2>

      {reviewList?.data.map((item, i) => (
        <div
          key={i}
          className="mt-4 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              {formatAppointmentDate(new Date())}
            </span>
            {getStatusBadge(item.status)}
          </div>

          <h2 className="text-sm font-semibold mb-2">
            Feedback for Dr. Gaurav baraawa
          </h2>

          <div className="">
            <div className="flex items-center gap-2 mb-2">
              {item.recommendation === "yes" ? (
                <>
                  <FaThumbsUp className="text-green-500" />
                  <p className="text-sm">I recommend the doctor</p>
                </>
              ) : (
                <>
                  <FaThumbsDown className="text-red-500" />
                  <p className="text-sm text-red-500">
                    I do not recommend the doctor
                  </p>
                </>
              )}
            </div>
            <p className="text-sm mb-3">
              I visited for {item.specialization.name}
            </p>
            <p className="text-sm">{item.desc}</p>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button className="cursor-pointer text-blue-500 hover:text-blue-700">
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="cursor-pointer text-red-500 hover:text-red-700"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000008c] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this member?</p>
            <div className="flex justify-end gap-4">
              <button
                className="cursor-pointer px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
