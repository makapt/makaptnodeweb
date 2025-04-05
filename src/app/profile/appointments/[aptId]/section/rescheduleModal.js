"use client";
import appointmentFactory from "@/actions/appointmentAction";
import { scrollToTop } from "@/components/ScrollTop";
import { formatSchedule } from "@/utils/helper";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RescheduleModal({
  isOpen,
  setIsOpen,
  docId,
  aptId,
  fetchData,
}) {
  const [schedules, setSchedules] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const handlerClose = () => {
    setIsOpen(false);
  };

  const fetchDetails = async () => {
    try {
      const res = await appointmentFactory.getschedulelist(docId);
      const result = formatSchedule(res.data.data);
      setSchedules(result);
      const firstAvailableIndex = result?.findIndex(
        (schedule) => schedule.times !== "Unavailable"
      );

      if (firstAvailableIndex !== -1) {
        setSelectedTab(firstAvailableIndex);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleReschedule = async () => {
    try {
      const date = new Date(schedules[selectedTab].date);
      const res = await appointmentFactory.rescheduleAppt(
        { appointmentDate: date, isRescheduleBy: "self" },
        aptId
      );
      toast.success(res.data.data);
      fetchData();
      handlerClose();
      scrollToTop();
    } catch (e) {
      toast.error(e.response?.data?.message || e?.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handlerClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-end md:items-center justify-center z-50">
        <div className="bg-white w-full max-w-md md:max-w-lg rounded-t-lg md:rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
            <button
              onClick={handlerClose}
              className="text-gray-600 hover:text-black"
            >
              ❌
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[70vh]">
            <div className="bg-white w-full p-2">
              <div className="space-y-2 mb-4">
                <aside className="w-full bg-white h-fit">
                  <div className="">
                    <div className="border-b border-gray-300 pb-2 flex gap-2 overflow-x-auto">
                      {schedules?.slice(0, 4).map((schedule, index) => {
                        return (
                          <button
                            key={index}
                            className={`px-4 py-2 rounded transition-colors ${
                              schedule?.times === "Unavailable"
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Lighter gray for disabled
                                : selectedTab === index
                                ? "bg-blue-500 text-white cursor-pointer" // Active button
                                : "bg-gray-100 text-gray-800 cursor-pointer" // Unselected button
                            }`}
                            disabled={schedule?.times === "Unavailable"}
                            onClick={() => {
                              if (schedule?.times !== "Unavailable") {
                                setSelectedTab(index);
                              }
                            }}
                          >
                            <div className="w-10">{schedule.label}</div>
                          </button>
                        );
                      })}
                    </div>

                    {schedules?.[selectedTab]?.times !== "Unavailable" && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Available Time</h3>
                        <div className="grid grid-cols-1">
                          {schedules[selectedTab]?.times.map((newItem, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-2 mb-4 mt-2"
                            >
                              <div className="font-medium">
                                Shift {j + 1} :{" "}
                              </div>
                              <button className="px-4 py-2 rounded transition-colors bg-gray-200">
                                {newItem.from} {" - "} {newItem.to}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </aside>
              </div>
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
              onClick={handleReschedule}
              className={`w-1/2 text-white px-4 py-2 rounded bg-blue-600`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
