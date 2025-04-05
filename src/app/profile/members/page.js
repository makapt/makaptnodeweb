"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileFactory from "@/actions/profileAction";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [memberList, setMemberList] = useState({ data: [], total: 0 });
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    const result = await profileFactory.getMember();
    setMemberList(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const res = await profileFactory.deleteMember(deleteId);
      toast.success(res.data.data);
      fetchData();
      setDeleteId(null);
    } catch (e) {
      console.log("e", e);
    }
  };

  return (
    <div className="mt-6 md:mt-0">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Total 3</h2>
        <button
          className="text-blue-600 text-base font-semibold hover:underline focus:outline-none"
          onClick={() => router.push("/profile/members/add-member")} // Replace with actual function
        >
          + Add
        </button>
      </div>

      <div className="mt-4 px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberList?.data.map((item, i) => (
          <div
            key={i}
            className={`p-4 md:p-6 rounded-lg drop-shadow-lg relative ${
              item.isDefault
                ? "border-2 border-blue-500 bg-blue-50"
                : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold mb-1">
                {item.patientName}
              </h2>
              {!item.isDefault && (
                <button
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>

            <p className="text-sm mb-1">{item.mobile}</p>
            <p className="text-sm mb-2 capitalize">
              {item.gender} | {item.age}
            </p>

            <div className="mt-3">
              <p className="text-sm md:text-base mb-1 flex items-center gap-3">
                {item.address}
              </p>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="px-4 fixed inset-0 flex items-center justify-center bg-[#0000008c] bg-opacity-50">
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
