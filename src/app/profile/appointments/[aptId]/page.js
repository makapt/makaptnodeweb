"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import CacheImage from "@/components/ui/cacheImage";
import { useParams, useRouter } from "next/navigation";
import {
  formatFullDate,
  renderEducation,
  renderSpecialist,
  slugify,
} from "@/utils/helper";
import appointmentFactory from "../../../../actions/appointmentAction";
import {
  FiCalendar,
  FiXCircle,
  FiHome,
  FiCreditCard,
  FiMapPin,
  FiArrowLeft,
} from "react-icons/fi";
import CancelAptModal from "./section/cancelAptModal";
import RescheduleModal from "./section/rescheduleModal";
import PatientDetail from "./section/patientDetail";

export default function DoctorDetailsPage() {
  const router = useRouter();
  const { aptId } = useParams();
  const [apptDetail, setDetail] = useState(null);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [isRescheduleOpen, setRescheduleOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const result = await appointmentFactory.appointmentDetail(aptId);
    setDetail(result.data);
  }, [aptId]); // ✅ Depend on `aptId`

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!apptDetail) return <p>Loading...</p>;

  const getStatusBadge = (status) => {
    const statusStyles = {
      cancelled: "bg-[rgba(255,44,0,0.1)] text-[#ff2c00]",
      completed: "bg-[#28a745] text-[#fff]",
      pending: "bg-[rgba(255,165,0,0.1)] text-[#ffa500]",
    };

    return (
      <span
        className={`px-2 py-1 rounded-sm text-[12px] ${
          statusStyles[status] || "bg-gray-200 text-gray-600"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const goBack = () => {
    router.push("/profile/appointments");
  };

  const slugifyurl = (fullName, doctorId) => {
    const slug = slugify(fullName);
    const joinNameId = slug + "-" + doctorId;
    return joinNameId;
  };

  return (
    <div className="mt-6 md:mt-0">
      <button
        onClick={goBack}
        className="md:hidden px-4 py-2 flex items-center text-blue-600 hover:text-blue-800 text-md font-medium"
      >
        <FiArrowLeft className="mr-1 h-5 w-5" />
        Back
      </button>
      <div className="flex items-center justify-between px-4 sm:px-4">
        <h2 className="text-lg font-semibold">Appointment Details</h2>
        <button
          className="cursor-pointer text-blue-600 text-base font-semibold hover:underline focus:outline-none"
          onClick={() => router.push("/help-support?id=" + aptId)} // Replace with actual function
        >
          Need Help?
        </button>
      </div>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-4">
          <div className="">
            <div className="w-full bg-white rounded shadow border border-gray-300">
              <div className="flex items-center justify-between p-2 md:p-4">
                <span className="text-sm md:text-base font-semibold">
                  Appointment ID #{apptDetail.data.apptID}
                </span>
                {getStatusBadge(apptDetail.data.apptStatus)}
              </div>
              <div
                onClick={() =>
                  router.push(
                    `/doctors/${slugifyurl(
                      apptDetail.data.doctorDetails.fullName,
                      apptDetail.data.doctorId
                    )}?type=doctor`
                  )
                }
                className="cursor-pointer b-black w-full flex items-center gap-4 p-2 md:p-4"
              >
                <CacheImage
                  path={apptDetail.path}
                  src={apptDetail.data?.doctorDetails?.image}
                  width={100}
                  height={100}
                />

                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <h1 className="text-lg font-semibold">
                      {apptDetail.data.doctorDetails.fullName}
                    </h1>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">
                    {renderSpecialist(
                      apptDetail.data?.profiles[0]?.specialization
                    )}
                  </p>
                  <p className="hidden sm:block text-gray-600 text-sm font-medium">
                    {renderEducation(apptDetail.data.education)}
                  </p>
                  <p className="text-gray-600 font-bold text-sm">
                    Fees: {apptDetail.data.apptFees}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-white p-4 rounded shadow border border-gray-300">
              <div className="flex items-center">
                <h2 className="text-base font-semibold flex-1">
                  Appointment Detail
                </h2>
              </div>

              {/* Appointment Info */}
              <div className="mt-4 space-y-3">
                <div
                  className="flex items-center justify-between p-2 rounded-md"
                  style={{ backgroundColor: "#E6E6F6", color: "#4C4DDC" }}
                >
                  <span className="text-sm md:text-base font-semibold flex items-center">
                    {formatFullDate(new Date(apptDetail.data.appointmentDate))}
                  </span>
                  <span className="text-sm md:text-base font-semibold">
                    W.N. {apptDetail.data.waitingList}
                  </span>
                </div>

                {/* Clinic Name */}
                <div className="flex items-center p-2">
                  <FiHome className="mr-3 text-xl text-gray-600" />
                  <p className="text-sm text-gray-900">
                    {apptDetail.data.doctorDetails.clinicName}
                  </p>
                </div>

                {/* Address */}
                <div className="flex items-center p-2">
                  <FiMapPin className="mr-3 text-xl text-gray-600" />
                  <p className="text-sm text-gray-900">
                    {apptDetail.data.doctorDetails.address.formatted_address}
                  </p>
                </div>

                {/* Patient Name */}
                <div className="flex items-center p-2">
                  <FiCreditCard className="mr-3 text-xl text-gray-600" />
                  <p className="text-sm text-gray-900 capitalize">
                    Payment {apptDetail.data.transactions[0].paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            <PatientDetail data={apptDetail.data} />
            <div className="mt-4 w-full bg-white p-6 rounded shadow border border-gray-300">
              <h2 className="text-base font-semibold flex-1">Payment Detail</h2>

              <div className="mt-4 space-y-2 bg-white">
                {apptDetail.data.transactions[0].paymentStatus ===
                  "received" && (
                  <div className="mb-4  flex items-center justify-between bg-green-100 p-2 rounded-md">
                    <p className="text-sm font-medium text-green-700">
                      Payment Status
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      ✅ Fully Paid
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-b pb-2">
                  <p className={`text-sm font-medium text-gray-900`}>
                    {apptDetail.data.transactions[0].paymentStatus ===
                    "received"
                      ? "Consultation Fee (Paid at Clinic)"
                      : "Consultation Fee (Pay at Clinic)"}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      apptDetail.data.transactions[0].paymentStatus ===
                      "received"
                        ? "text-green-600"
                        : "text-red-900"
                    }  `}
                  >
                    ₹{apptDetail.data.apptFees}
                  </p>
                </div>

                {/* Amount Already Paid */}
                <div className="flex items-center justify-between border-b pb-2">
                  <p className="text-sm text-gray-600">Booking Fee (Paid)</p>
                  <p className="text-sm font-semibold text-green-600">
                    ₹{apptDetail.data.transactions[0].tax_service_charge}
                  </p>
                </div>

                {/* Total Charge */}
                <div className="flex items-center justify-between font-semibold">
                  <p className="text-sm text-gray-900">Total Charge</p>
                  <p className="text-sm text-gray-900">
                    ₹{apptDetail.data.transactions[0].totalCharges}
                  </p>
                </div>
              </div>
            </div>
            {apptDetail.data.apptStatus === "pending" && (
              <div className="mt-4 space-y-2">
                {/* Reschedule Appointment */}
                <button
                  onClick={() => setRescheduleOpen(true)}
                  className="cursor-pointer w-full bg-white flex items-center justify-between p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">
                      Reschedule Appointment
                    </span>
                  </div>
                </button>

                {/* Cancel Appointment */}
                <button
                  onClick={() => setCancelOpen(true)}
                  className="cursor-pointer w-full bg-white flex items-center justify-between p-3 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <FiXCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">
                      Cancel Appointment
                    </span>
                  </div>
                </button>
              </div>
            )}

            <CancelAptModal
              aptId={aptId}
              isOpen={isCancelOpen}
              setIsOpen={setCancelOpen}
              fetchData={fetchData}
            />
            <RescheduleModal
              aptId={aptId}
              isOpen={isRescheduleOpen}
              setIsOpen={setRescheduleOpen}
              docId={apptDetail.data.doctorId}
              fetchData={fetchData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
