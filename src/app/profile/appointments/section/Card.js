import CacheImage from "@/components/ui/cacheImage";
import { formattedDate } from "@/utils/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCalendarAlt, FaUser, FaMapMarkerAlt } from "react-icons/fa";

export default function Card({ path, item, rebookHandler, getStatusBadge }) {
  const router = useRouter();
  return (
    <div className="mb-4 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm md:text-base font-semibold">
          #{item.apptID}
        </span>
        {getStatusBadge(item.apptStatus)}
      </div>

      <div
        onClick={() => {
          router.push(`/profile/appointments/${item._id}`);
        }}
        className="cursor-pointer flex md:flex-row gap-4 md:gap-6"
      >
        <div className="md:w-20 h-auto md:h-20 mb-4 md:mb-0 flex items-start">
          <CacheImage
            path={path}
            src={item?.profiles?.[0]?.image || item.doctorDetails?.image}
            width={70}
            height={70}
          />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold mb-1">
            <Link href={`#`} className="text-blue-600 hover:underline">
              {item.doctorDetails.fullName}
            </Link>
          </h2>
          <p className="text-sm mb-1">{item.doctorDetails.clinicName}</p>
          <p className="text-sm mb-2">
            <FaMapMarkerAlt className="inline-block text-red-500" />{" "}
            {item.doctorDetails.address.city},{" "}
            {item.doctorDetails.address.state}
          </p>
        </div>
      </div>

      <div className="block md:flex justify-between mt-3 gap-2">
        <div>
          <p className="text-sm md:text-base mb-1 flex items-center gap-3">
            <FaUser className="text-green-500 text-base md:text-lg" />
            {item.patientInfo.patientName},{" "}
            {item.patientInfo.gender.charAt(0).toUpperCase() +
              item.patientInfo.gender.slice(1)}
            , {item.patientInfo.age} Yrs
          </p>
          <p className="text-sm md:text-base mb-1 flex items-center gap-3">
            <FaCalendarAlt className="text-blue-500 text-base md:text-lg" />
            {formattedDate(item.appointmentDate)} | W.No {item.waitingList}
          </p>
        </div>
        <div className="flex justify-between mt-4 gap-2">
          <button
            onClick={() => rebookHandler(item)}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            Rebook Appointment
          </button>
          {item.apptStatus === "pending" && (
            <button className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">
              Direction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
