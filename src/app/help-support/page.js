"use client";

import { FaPhoneAlt } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import profileFactory from "@/actions/profileAction";
import appointmentFactory from "@/actions/appointmentAction";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatAppointmentDate } from "@/utils/helper";
import CacheImage from "@/components/ui/cacheImage";
import { FiArrowLeft } from "react-icons/fi";

import Link from "next/link";

export default function HelpSupport() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apptData, setApptData] = useState({});
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(false);

  const id = searchParams.get("id");

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const appt = await appointmentFactory.appointmentDetail(id);
      const getFaqs = await profileFactory.appGetIssue("selectedAppointment");
      setFaqData(getFaqs.data.data);
      setApptData(appt.data);
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  }, [id]); // 👈 include id because it’s used inside fetchList

  useEffect(() => {
    fetchList();
  }, [fetchList]);

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
    router.back();
  };
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between relative">
        <button
          onClick={goBack}
          className="md:hidden flex items-center text-blue-600 hover:text-blue-800 text-md font-medium"
        >
          <FiArrowLeft className="mr-1 h-5 w-5" />
          Back
        </button>

        {/* Centered Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
          Help & Support
        </h1>
      </div>

      {apptData.data && (
        <div className="mb-4 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm md:text-base font-semibold">
              Appointment ID #{apptData.data.apptID}
            </span>
            {getStatusBadge(apptData.data.apptStatus)}
          </div>

          <div className="cursor-pointer flex md:flex-row gap-4 md:gap-6">
            <div className="md:w-20 h-auto md:h-20 flex items-start">
              <CacheImage
                path={apptData.path}
                src={
                  apptData.data?.profiles?.[0]?.image ||
                  apptData.data.doctorDetails.image
                }
                width={50}
                height={50}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold mb-1">
                <Link
                  href={`/profile/appointments/${apptData.data._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {apptData.data.doctorDetails.fullName}
                </Link>
              </h2>
              <p className="text-sm md:text-base mb-1">
                {formatAppointmentDate(apptData.data.appointmentDate)} | W.N. 21
              </p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-md md:text-2xl font-bold mt-8">
        Select The Category You Have An Issue With
      </h1>

      <div className="mb-4 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg">
        <ul className="">
          {faqData.map((issue, index) => (
            <Link
              href={"/help-support/" + issue._id}
              key={index}
              className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              <span>{issue.question}</span>
              <FiChevronRight className="text-gray-500 w-5 h-5" />
            </Link>
          ))}
        </ul>
      </div>
      {/* Contact Us */}
      <div className="flex justify-center mt-4">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          <FaPhoneAlt className="w-4 h-4" />
          Contact Support
        </button>
      </div>
    </div>
  );
}
