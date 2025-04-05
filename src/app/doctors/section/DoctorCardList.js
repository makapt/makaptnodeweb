import React from "react";
import { renderEducation, renderSpecialist } from "@/utils/helper";
import CacheImage from "@/components/ui/cacheImage";

export default function DoctorCardList({
  path,
  doctor,
  handleBookAppointment,
  slug,
}) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-shrink-0">
        <CacheImage path={path} src={doctor.image} width={120} height={120} />
      </div>

      {/* Doctor Details */}
      <div className="flex flex-col flex-grow w-full">
        <a
          target="_blank"
          href={`/doctors/${doctor.doctors[0].fullName}?type=doctor&id=${doctor.doctorId}`}
          className="text-base font-semibold text-blue-600 hover:underline"
        >
          {doctor.doctors[0].fullName}
        </a>
        <p className="text-sm font-semibold" style={{ color: "#989795" }}>
          {renderSpecialist(doctor.specialization, slug)}
        </p>
        <p className="text-sm font-medium" style={{ color: "#989795" }}>
          {renderEducation(doctor.educations)}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              {doctor.workExperience} years experience overall
            </p>
            <p className="text-sm text-gray-600">
              {doctor.address.locality + ", " + doctor.address.city}
            </p>
          </div>
          <p className="text-sm text-lg font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
            Fees: {doctor.normalFee}
          </p>
        </div>
        <p className="text-sm text-gray-600">{doctor.location}</p>

        {/* Review & Booking Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
          {/* Patient Stories */}
          <div className="flex items-center text-green-600 text-sm">
            👍 98%{" "}
            <span className="text-sm text-gray-600 ml-1">
              30 Patient Stories
            </span>
          </div>

          {/* Book Appointment Button */}
          <button
            onClick={() => handleBookAppointment(doctor)}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto cursor-pointer"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
