"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaShareAlt,
  FaHospital,
  FaTrophy,
  FaLanguage,
  FaUserMd,
} from "react-icons/fa";
import appMockup from "@/assets/img/blank-profile-picture.png";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import doctorFactory from "@/actions/doctorAction";
import { formatSchedule } from "@/utils/helper";
import { renderEducation, renderSpecialist } from "@/utils/helper";
import { useRouter } from "next/navigation"; // Import useRouter
import { useApplicationContext } from "@/context/ApplicationContext";
import CacheImage from "@/components/ui/cacheImage";

export default function DoctorDetailsPage() {
  const { isLoggedInUser } = useApplicationContext();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = useCallback(async () => {
    try {
      const result = await doctorFactory.doctordetail({ id });

      if (!result?.data) return; // Prevent errors if API response is undefined

      setDoctor(result.data);

      const res = formatSchedule(result.data.data.schedules);
      setSchedules(res);

      const firstAvailableIndex = res?.findIndex(
        (schedule) => schedule.times !== "Unavailable"
      );

      if (firstAvailableIndex !== -1) {
        setSelectedTab(firstAvailableIndex);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  }, [id]); // ✅ Added 'id' as a dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ Ensures fetchData runs when 'id' changes

  const handleConfirmAppointment = () => {
    if (isLoggedInUser) {
      router.push(
        `/appointment-summery?apptdate=${schedules[selectedTab].date}&id=${doctor.data.doctorId}`
      );
    } else {
      const queryParams = new URLSearchParams({
        redirectionURL: `/appointment-summery?apptdate=${schedules[selectedTab].date}&id=${doctor.data.doctorId}`,
      });
      router.push(`/getstarted?${queryParams.toString()}`);
    }
  };
  if (!doctor) return <p>Loading...</p>;

  console.log("schedules", schedules);

  return (
    <div className="pt-20 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* ✅ Breadcrumb Above Everything */}
        <nav className="text-sm text-gray-600 mb-4 mt-4">
          <ul className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/doctors" className="hover:text-blue-600">
                Doctors
              </Link>
            </li>
            <li>/</li>
            <li className="text-blue-600 font-medium">{doctor.name}</li>
          </ul>
        </nav>

        {/* Main Container */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section - Doctor Info */}
          <div className="w-full md:w-[65%] bg-white p-6 rounded shadow border border-gray-300">
            {/* Doctor Image & Details */}
            <div className="w-full flex items-center gap-4">
              <CacheImage
                path={doctor.path}
                src={doctor.data.image}
                width={120}
                height={120}
              />

              <div className="w-full">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-semibold">
                    {doctor.data.fullName}
                  </h1>
                  <FaShareAlt className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg font-medium">
                  {renderSpecialist(doctor.data.specialization)}
                </p>
                <p className="text-gray-600 text-lg font-medium">
                  {renderEducation(doctor.data.educations)}
                </p>
                <p className="text-gray-600">
                  Experience: {doctor.data.workExperience} years
                </p>
                <p className="text-gray-600 font-bold text-lg">
                  Fees: {doctor.data.doctor_financials[0].normalFee}
                </p>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">About</h2>
              <div
                className="text-gray-700 mt-2"
                dangerouslySetInnerHTML={{ __html: doctor.data.about }}
              />
            </div>

            {/* Education Section */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaUserMd className="text-blue-500" /> Education & Training
              </h2>
              <ul className="text-gray-700 mt-2 list-disc list-inside">
                {doctor.data.educations.map((edu, index) => (
                  <li key={index}>
                    <strong>{edu.degree}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience Section */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaHospital className="text-green-500" /> Experience
              </h2>
              <ul className="text-gray-700 mt-2 list-disc list-inside">
                {doctor.data.experiences.map((exp, index) => (
                  <li key={index}>
                    <strong>{exp.title}</strong> at {exp.clinicName}
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages Spoken */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaLanguage className="text-purple-500" /> Languages Spoken
              </h2>
              <p className="text-gray-700 mt-2">Hindi, English</p>
            </div>
          </div>

          {/* Right Section - Appointments */}
          <aside className="w-full md:w-[35%] bg-white p-6 rounded shadow border border-gray-300 h-fit">
            {/* Header */}
            <div className="relative p-4 border-b border-gray-300 bg-white flex items-center">
              <h2 className="text-xl font-semibold flex-1 text-center">
                Book Appointment
              </h2>
            </div>

            {doctor && (
              <div className="">
                {/* Date Selection Tabs */}
                <div className="mt-4 border-b border-gray-300 pb-2 flex gap-2 overflow-x-auto">
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
                          <div className="font-medium">Shift {j + 1} : </div>
                          <button className="px-4 py-2 rounded transition-colors bg-gray-200">
                            {newItem.from} {" - "} {newItem.to}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleConfirmAppointment}
              className="cursor-pointer mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded text-lg font-medium"
            >
              Confirm Booking
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
