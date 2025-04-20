"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
import authFactory from "@/actions/authAction";
import { useApplicationContext } from "@/context/ApplicationContext";

const reasonList = [
  {
    label: "No longer using the service/platform",
    value: "No longer using the service/platform",
  },
  { label: "Found a better alternative", value: "Found a better alternative" },
  { label: "Policy concerns", value: "Policy concerns" },
  {
    label: "Too many emails/notifications",
    value: "Too many emails/notifications",
  },
  { label: "Account security concerns", value: "Account security concerns" },
  { label: "Personal reasons", value: "Personal reasons" },
  { label: "Others", value: "Others" },
];
const settingsOptions = [
  { label: "Change Password", href: "/settings/change-password" },
  { label: "Delete Account", href: "/settings/delete-account" },
];
export default function DeleteAccountPage() {
  const { handlerLogout } = useApplicationContext();
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [additionalReason, setAdditionalReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleCheckboxChange = (value) => {
    setSelectedReasons((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedReasons.length === 0) {
      toast.error("Please select anyone the reason");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    try {
      const payload = {
        comment: additionalReason,
        reason: selectedReasons[0],
      };
      await authFactory.accountDelete(payload);
      setIsSuccessOpen(true);
      setTimeout(() => {
        handlerLogout();
      }, 2000);
    } catch (e) {
      console.log("error11", e.message);
    }
  };

  const goBack = () => {
    router.push("/settings");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-200 text-gray-900 p-6 flex-col space-y-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold">Settings</h2>
        <nav>
          <ul className="space-y-2">
            {settingsOptions.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  className={`block p-2 rounded transition-all ${
                    activeItem === item.href
                      ? "bg-blue-500 text-white font-semibold"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveItem(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:p-6 rounded-lg shadow-md">
        <div className="bg-white w-full md:w-4/5">
          <div className="ml-4 mr-4 p-0 md:p-4">
            <button
              onClick={goBack}
              className="py-4 md:hidden flex items-center text-blue-600 hover:text-blue-800 text-md font-medium"
            >
              <FiArrowLeft className="mr-1 h-5 w-5" />
              Back
            </button>
            <h1 className="text-xl font-semibold mb-4">Delete Account</h1>

            <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-6">
              <div>
                <p className="font-medium mb-2">Why are you leaving?</p>
                <div className="space-y-2">
                  {reasonList.map((reason, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={reason.value}
                        checked={selectedReasons.includes(reason.value)}
                        onChange={() => handleCheckboxChange(reason.value)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional feedback
                </label>
                <textarea
                  rows={4}
                  placeholder="Write something..."
                  value={additionalReason}
                  onChange={(e) => setAdditionalReason(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex">
                <button
                  type="submit"
                  className="cursor-pointer bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Modal */}
            <Dialog
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                  className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="delete-dialog-title"
                >
                  <h2
                    id="delete-dialog-title"
                    className="text-lg font-semibold mb-4"
                  >
                    Confirm Deletion
                  </h2>
                  <div className="mb-6 text-sm text-gray-700">
                    <p>
                      Are you sure you want to delete your account? This action
                      is
                      <span className="font-medium text-red-600">
                        {" "}
                        permanent
                      </span>{" "}
                      and cannot be undone.
                    </p>

                    <p className="mt-3">
                      Once deleted, you will lose access to all your data
                      including:
                    </p>

                    <ul className="list-disc list-inside mt-2 text-gray-700 text-sm">
                      <li>Your account details</li>
                      <li>Booking and consultation history</li>
                      <li>Saved doctors and preferences</li>
                      <li>Any reviews you’ve written</li>
                    </ul>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Dialog>

            <Dialog
              open={isSuccessOpen}
              onClose={() => {}}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                  className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl text-center"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="success-dialog-title"
                >
                  {/* ✅ Success Icon */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  {/* ✅ Heading */}
                  <h2
                    id="success-dialog-title"
                    className="text-lg font-semibold text-gray-900 mb-2"
                  >
                    Account Deleted
                  </h2>

                  {/* ✅ Subtext */}
                  <p className="text-sm text-gray-600 mb-2">
                    Your account has been successfully deleted.
                  </p>
                  <p className="text-xs text-gray-400">
                    Redirecting to home...
                  </p>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  );
}
