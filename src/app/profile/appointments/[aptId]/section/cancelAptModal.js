"use client";
import appointmentFactory from "@/actions/appointmentAction";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { scrollToTop } from "@/components/ScrollTop";

const cancelList = [
  {
    label: "Booked with wrong user details.",
    value: "Booked with wrong user details.",
    checked: false,
  },
  { label: "I am busy.", value: "I am busy.", checked: false },
  {
    label: "Forgot about the appointment",
    value: "Forgot about the appointment",
    checked: false,
  },
  { label: "Changed my Mind", value: "Changed my Mind", checked: false },
  {
    label: "Visited another doctor",
    value: "Visited another doctor",
    checked: false,
  },
  {
    label: "Clinic/Hospital is far",
    value: "Clinic/Hospital is far",
    checked: false,
  },
  {
    label: "Doctor asked me to cancel",
    value: "Doctor asked me to cancel",
    checked: false,
  },
  { label: "Others", value: "Others", checked: false },
];

export default function CancelAptModal({
  isOpen,
  setIsOpen,
  aptId,
  fetchData,
}) {
  const [cancelReason, setCancelReason] = useState("");
  const [comment, setComment] = useState("");

  const handlerCancel = async () => {
    const payload = {
      comment,
      reason: cancelReason,
    };
    try {
      const res = await appointmentFactory.cancelAppointment(payload, aptId);
      toast.success(res.data.data);
      fetchData();
      setIsOpen(false);
      scrollToTop();
    } catch (e) {}
  };

  const handlerClose = () => {
    setIsOpen(false);
    setCancelReason("");
    setComment("");
  };

  return (
    <Dialog open={isOpen} onClose={handlerClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end md:items-center justify-center z-50">
        <div className="bg-white w-full max-w-md md:max-w-lg rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <h2 className="text-lg font-semibold">Cancel Appointment</h2>
            <button
              onClick={handlerClose}
              className="text-gray-600 hover:text-black"
            >
              ❌
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[70vh]">
            <div className="bg-white w-full p-2">
              <p className="text-sm text-gray-600 mb-3">
                Why are you cancelling?
              </p>

              <div className="space-y-2 mb-4">
                {cancelList.map((reason, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason.value}
                      checked={cancelReason === reason.value}
                      onChange={() => setCancelReason(reason.value)}
                    />
                    {reason.label}
                  </label>
                ))}
              </div>

              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Write your reason here..."
                rows={3}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-white flex gap-4">
            <button
              onClick={handlerClose}
              className="w-1/2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              disabled={cancelReason == ""}
              onClick={handlerCancel}
              className={`w-1/2 text-white px-4 py-2 rounded ${
                cancelReason === "" ? "bg-gray-600" : "bg-blue-600"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
