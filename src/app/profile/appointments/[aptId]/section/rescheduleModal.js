"use client";
import appointmentFactory from "@/actions/appointmentAction";
import doctorFactory from "@/actions/doctorAction";
import Schedule from "@/app/doctors/[doctorId]/schedule";
import { scrollToTop } from "@/components/ScrollTop";
import { applyUnavailabilityToSchedule, formatSchedule } from "@/utils/helper";
import { Dialog } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
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

  const fetchDetails = useCallback(async () => {
    try {
      const res = await appointmentFactory.getschedulelist(docId);
      const unavailabilityData = await doctorFactory.getDoctorUnavailability({
        id: docId,
      });
      const result = formatSchedule(res.data.data);
      const updatedSchedule = applyUnavailabilityToSchedule(
        result,
        unavailabilityData.data.data
      );
      setSchedules(updatedSchedule);
      const firstAvailableIndex = result?.findIndex(
        (schedule) => schedule.times !== "Unavailable"
      );

      if (firstAvailableIndex !== -1) {
        setSelectedTab(firstAvailableIndex);
      }
    } catch (e) {
      console.log("error", e);
    }
  }, [docId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

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
  console.log("schedules", schedules);
  console.log("selectedTab", selectedTab);
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
                <aside className="w-full bg-white p-4 rounded shadow border border-gray-300 h-fit">
                  <Schedule
                    schedules={schedules}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    handleConfirmAppointment={handleReschedule}
                  />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
