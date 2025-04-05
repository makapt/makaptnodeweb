"use client";

import { mobileMenuItem } from "@/constants/menuItem";
import Link from "next/link";
import appMockup from "@/assets/img/blank-profile-picture.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import appointmentFactory from "@/actions/appointmentAction";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [apptList, setApptList] = useState({ data: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  const renderUserInfoWithAptDate = (item) => {
    return (
      <div>
        <p className="text-sm md:text-base mb-1 flex items-center gap-3">
          <FaCalendarAlt className="text-blue-500 text-base md:text-lg" />
          {formatAppointmentDate(item.appointmentDate)}
        </p>

        {/* Patient Name with Icon */}
        <p className="text-sm md:text-base mb-1 flex items-center gap-3">
          <FaUser className="text-green-500 text-base md:text-lg" />
          {item.patientInfo.patientName},{" "}
          {item.patientInfo.gender.charAt(0).toUpperCase() +
            item.patientInfo.gender.slice(1)}
          , {item.patientInfo.age} Yrs
        </p>
      </div>
    );
  };

  function formatAppointmentDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${formattedDate} (${weekday})`;
  }

  return (
    <div className=" ">
      {apptList?.data.map((item, i) => {
        return (
          <div
            key={i}
            className="mt-4 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm md:text-base font-semibold mb-2">
                Appointment ID #{item.apptID}
              </span>
              {getStatusBadge(item.apptStatus)}
            </div>

            <div className="flex  md:flex-row gap-4 md:gap-6">
              {/* Doctor Image */}
              {/* Modified div to ensure image and details are in same row on mobile */}

              {/* Appointment Details */}
              <div className="flex-1">
                <h2 className="text-base font-semibold mb-1">
                  {item.doctorDetails.fullName}
                </h2>

                <p className="hidden md:block text-sm text-gray-500 mb-1">
                  Cardiology, General Physician, Dentist
                </p>
                <div className="block md:flex gap-4 items-center">
                  <p className="text-sm mb-1">
                    {item.doctorDetails.clinicName}
                  </p>
                  <div className="flex gap-2 items-center justify-between">
                    {/* Map Pin Icon - Visible only on Desktop */}
                    <FaMapMarkerAlt className="hidden md:block text-red-500 text-base md:text-lg" />
                    <p className="text-sm mb-2">
                      {item.doctorDetails.address.city +
                        ", " +
                        item.doctorDetails.address.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="block md:flex justify-between mt-3 gap-2">
              <div className=" ">{renderUserInfoWithAptDate(item)}</div>
              <div className="flex justify-between mt-4 gap-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
                  Rebook Appointment
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">
                  View Detail
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
