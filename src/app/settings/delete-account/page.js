"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

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
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [additionalReason, setAdditionalReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckboxChange = (value) => {
    setSelectedReasons((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    // TODO: handle final delete logic
    setIsModalOpen(false);
    console.log("Delete account confirmed");
  };

  const goBack = () => {
    router.push("/settings");
  };

  return (
    <div className="pt-18 md:pt-24 flex min-h-screen bg-gray-100">
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
          <div className="p-4">
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
                  {reasonList.map((reason) => (
                    <label
                      key={reason.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
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
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
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
                <Dialog.Panel className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
                  <Dialog.Title className="text-lg font-semibold mb-4">
                    Confirm Deletion
                  </Dialog.Title>
                  <p className="mb-6 text-sm text-gray-700">
                    Are you sure you want to delete your account? This action is
                    permanent.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  );
}
