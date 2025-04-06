import React from "react";
import { renderEducation, renderSpecialist } from "@/utils/helper";
import CacheImage from "@/components/ui/cacheImage";
import useDeviceType from "@/hooks/useDeviceType";
import { useRouter } from "next/navigation";

export default function DoctorCardList({
  path,
  doctor,
  handleBookAppointment,
  slug,
}) {
  const { isMobile, isDesktop } = useDeviceType();
  const router = useRouter();

  const redirectDetail = (doctor) => {
    if (isDesktop) {
      window.open(
        `/doctors/${doctor.doctors.fullName}?type=doctor&id=${doctor.doctorId}`,
        "_blank"
      );
    } else {
      router.push(
        `/doctors/${doctor.doctors.fullName}?type=doctor&id=${doctor.doctorId}`
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-row gap-4 items-center ">
        <div
          className="cursor-pointer flex-shrink-0"
          onClick={() => redirectDetail(doctor)}
        >
          <CacheImage
            path={path}
            src={doctor.image}
            width={isMobile ? 80 : 120}
            height={isMobile ? 80 : 120}
          />
        </div>

        {/* Doctor Details */}
        <div
          onClick={() => redirectDetail(doctor)}
          className="cursor-pointer flex flex-col flex-grow w-full"
        >
          <a
            // target="_blank"
            // href={`/doctors/${doctor.doctors[0].fullName}?type=doctor&id=${doctor.doctorId}`}
            className="text-base font-bold text-[color:#121414] hover:underline"
          >
            {doctor.doctors.fullName}
          </a>

          <p className="text-sm font-medium" style={{ color: "#989795" }}>
            {renderSpecialist(doctor.specialization, slug)}
          </p>
          <p
            className="hidden sm:block text-sm font-medium"
            style={{ color: "#989795" }}
          >
            {renderEducation(doctor.educations)}
          </p>
          <p className="hidden sm:block text-sm text-gray-600">
            {doctor.workExperience} years experience overall
          </p>

          <div
            className="sm:hidden mt-1 flex flex-wrap items-center gap-1 text-sm"
            style={{ color: "#6b45c6", fontWeight: 700 }}
          >
            <p className="text-sm font-medium whitespace-nowrap">
              {doctor.workExperience} YEARS
            </p>
            <span className="mx-1 text-gray-400">•</span>
            <p
              className="text-sm font-medium truncate"
              style={{ maxWidth: "calc(100% - 80px)" }}
            >
              {renderEducation(doctor.educations).length > 10
                ? `${renderEducation(doctor.educations).slice(0, 10)}...`
                : renderEducation(doctor.educations)}
            </p>
          </div>

          <p
            className="mt-1 text-sm text-gray-600"
            style={{ color: "#989795" }}
          >
            {doctor.address.locality + ", " + doctor.address.city}
          </p>
          <div className="mt-2 mb-1 flex items-center text-green-600 text-sm">
            👍 98%{" "}
            <span className="text-sm text-gray-600 ml-1">
              30 Patient Stories
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 mt-2">
        <p className="text-sm font-bold text-blue-700 px-2 py-1">
          Consult Fee: ₹{doctor?.doctor_financials?.[0]?.normalFee}
        </p>

        <button
          onClick={() => handleBookAppointment(doctor)}
          className="bg-blue-600 text-sm text-white px-4 py-2 rounded cursor-pointer"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
