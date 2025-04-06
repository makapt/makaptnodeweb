"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { FaShareAlt, FaHospital, FaLanguage, FaUserMd } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import doctorFactory from "@/actions/doctorAction";
import { formatSchedule } from "@/utils/helper";
import { renderEducation, renderSpecialist } from "@/utils/helper";
import { useRouter } from "next/navigation"; // Import useRouter
import { useApplicationContext } from "@/context/ApplicationContext";
import CacheImage from "@/components/ui/cacheImage";
import useDeviceType from "@/hooks/useDeviceType";
import Schedule from "./schedule";

export default function DoctorDetailsPage() {
  const { isLoggedInUser } = useApplicationContext();
  const { isMobile, isDesktop } = useDeviceType();
  const router = useRouter();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [textlimit, setTextlimit] = useState(30);
  const [isredmore, setIsredmore] = useState(false);

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
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleAbout = (about) => {
    let newword = "";
    const words = about?.split(" ") ?? [];
    words?.slice(0, textlimit).forEach((item) => {
      newword += item + " ";
    });
    return newword;
  };

  const readMore = () => {
    if (isredmore) {
      setTextlimit(30);
      setIsredmore(false);
    } else {
      const words = doctor.data.about.split(" ");
      setTextlimit(words.length);
      setIsredmore(true);
    }
  };

  return (
    <div className="pt-20 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        <nav className="text-sm text-gray-600 mb-4 mt-4">
          <ul className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <button
                onClick={() => router.back()}
                className="cursor-pointer hover:text-blue-600"
              >
                Doctors
              </button>
            </li>
            <li>/</li>
            <li className="text-blue-600 font-medium">
              {decodeURIComponent(doctorId)}
            </li>
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
                width={isMobile ? 80 : 120}
                height={isMobile ? 80 : 120}
              />

              <div className="w-full">
                <div className="flex justify-between items-start">
                  <h1 className="text-md md:text-2xl font-semibold">
                    {doctor.data.fullName}
                  </h1>
                  <FaShareAlt className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600" />
                </div>
                <p className="text-sm md:text-lg font-medium">
                  {renderSpecialist(doctor.data.specialization)}
                </p>
                <p className="text-gray-600 text-sm md:text-lg font-medium">
                  {renderEducation(doctor.data.educations)}
                </p>
                <p className="text-gray-600 text-sm md:text-lg">
                  Experience: {doctor.data.workExperience} years
                </p>
              </div>
            </div>
            <div className="block md:hidden mt-6">
              <Schedule
                schedules={schedules}
                doctor={doctor}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                handleConfirmAppointment={handleConfirmAppointment}
              />
            </div>

            {/* About Section */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">About</h2>
              <div
                className="text-sm text-gray-700 mt-2"
                dangerouslySetInnerHTML={{
                  __html: handleAbout(doctor.data.about),
                }}
              />
              <div
                className="text-sm font-bold mt-4 text-[#6b45c6] border-b border-[#6b45c6] inline-block cursor-pointer hover:opacity-80"
                onClick={readMore}
              >
                {isredmore ? "Show Less" : "Read More"}
              </div>
            </div>

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

            <div className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaLanguage className="text-purple-500" /> Languages Spoken
              </h2>
              <p className="text-gray-700 mt-2">Hindi, English</p>
            </div>
          </div>

          {isDesktop && (
            <Schedule
              schedules={schedules}
              doctor={doctor}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              handleConfirmAppointment={handleConfirmAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
}
