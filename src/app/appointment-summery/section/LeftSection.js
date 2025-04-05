import React from "react";
import CacheImage from "@/components/ui/cacheImage";
import { FaClinicMedical, FaCalendarAlt } from "react-icons/fa";

export default function LeftSection({ doctor, apptdate }) {
  function formatFullDate(date) {
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div className="bg-white p-6 rounded shadow-md md:col-span-2">
      <CacheImage
        path={doctor.path}
        src={doctor.data.image}
        width={100}
        height={100}
      />

      <h2 className="text-xl font-semibold">{doctor.data.fullName}</h2>
      <p className="text-gray-600">
        Cardiologist | {doctor.data.workExperience}+ years experience
      </p>
      <p className="text-gray-600">
        Consult Fee: ₹{doctor.data.doctor_financials[0].normalFee}
      </p>

      {/* Appointment Details Section */}
      <div className="mt-4 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Appointment Details</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <FaClinicMedical size={18} />
          <p>Offline Consultation</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt size={18} />
          <p>{formatFullDate(new Date(apptdate))}</p>
        </div>
      </div>
    </div>
  );
}
