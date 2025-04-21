"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { BsPatchCheckFill } from "react-icons/bs"; // Import at the top
import { FaShareAlt, FaThumbsUp } from "react-icons/fa";
import Link from "next/link";
import doctorFactory from "@/actions/doctorAction";
import {
  applyUnavailabilityToSchedule,
  decodeSlug,
  formatSchedule,
} from "@/utils/helper";
import { renderEducation, renderSpecialist } from "@/utils/helper";
import { useRouter, useSearchParams } from "next/navigation";
import { useApplicationContext } from "@/context/ApplicationContext";
import CacheImage from "@/components/ui/cacheImage";
import useDeviceType from "@/hooks/useDeviceType";
import Schedule from "./schedule";
import toast from "react-hot-toast";
import TabComponent from "./TabComponent";
import LoginAlert from "./section/LoginAlert";

export default function DoctorDetailsPage() {
  const { isLoggedInUser } = useApplicationContext();
  const { isMobile, isDesktop } = useDeviceType();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctorId } = useParams();
  const tabValue = searchParams.get("tab") || "info";
  const { docName, docId } = decodeSlug(doctorId);

  const [doctor, setDoctor] = useState({ path: "" });
  const [schedules, setSchedules] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [textlimit, setTextlimit] = useState(30);
  const [isredmore, setIsredmore] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewList, setReviewList] = useState({ data: [] });
  const limit = tabValue === "review" ? 20 : 5;
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const count = doctor.data?.about?.split(" ")?.length || 0;
    setWordCount(count);
  }, [doctor.data]);

  const fetchData = useCallback(async () => {
    try {
      setLoader(true);
      const result = await doctorFactory.doctordetail({ id: docId });

      const unavailabilityData = await doctorFactory.getDoctorUnavailability({
        id: docId,
      });
      if (!result?.data) return;

      setDoctor(result.data);

      const res = formatSchedule(result.data.data.schedules);
      const updatedSchedule = applyUnavailabilityToSchedule(
        res,
        unavailabilityData.data.data
      );
      setSchedules(res);

      const firstAvailableIndex = res?.findIndex(
        (schedule) => schedule.times !== "Unavailable"
      );

      if (firstAvailableIndex !== -1) {
        setSelectedTab(firstAvailableIndex);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    } finally {
      setLoader(false);
    }
  }, [docId]);

  const getReviewList = useCallback(async () => {
    try {
      const rlist = await doctorFactory.reviewList({
        docId: docId,
        filter: "mostHelpful",
        limit: limit,
        page: 0,
      });
      setReviewList(rlist.data);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  }, [tabValue]);

  useEffect(() => {
    if (!reviewList.total || reviewList.total > 5) {
      getReviewList();
    }
  }, [getReviewList, tabValue]);

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

  const handleAbout = (about) => {
    if (!about) return "";
    const words = about.split(" ");
    return (
      words.slice(0, textlimit).join(" ") + (textlimit < wordCount ? "..." : "")
    );
  };

  const readMore = () => {
    if (isredmore) {
      setTextlimit(30);
      setIsredmore(false);
    } else {
      setTextlimit(wordCount);
      setIsredmore(true);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handlerShareReview = () => {
    if (isLoggedInUser) {
      router.push(`/doctors/${doctorId}/write-review`);
    } else {
      setShowModal(true);
    }
  };

  const handleLogin = () => {
    setShowModal(false);
    const queryParams = new URLSearchParams({
      redirectionURL: `/doctors/${doctorId}?type=doctor`,
    });
    router.push(`/getstarted?${queryParams.toString()}`);
  };

  return (
    <div className="bg-white md:bg-gray-100 min-h-screen">
      {loader && (
        <>
          <div className="flex gap-4 p-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4 p-4 max-w-md mx-auto">
            <div className="h-8 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-2/3 animate-pulse" />
          </div>
        </>
      )}
      {!loader && doctor.data && (
        <div className="max-w-7xl mx-auto p-4">
          <nav className="hidden md:block text-sm text-gray-600 mb-4 mt-0 md:mt-4">
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
              <li className="text-blue-600 font-medium">{docName}</li>
            </ul>
          </nav>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[65%] bg-white md:p-6 md:rounded md:shadow md:border md:border-gray-300">
              <div className="w-full flex items-center gap-4 md:gap-8">
                <CacheImage
                  path={doctor.path}
                  src={doctor.data.image}
                  width={isMobile ? 80 : 100}
                  height={isMobile ? 80 : 100}
                  style={{
                    width: isMobile ? 80 : 100,
                    height: isMobile ? 80 : 100,
                  }}
                />

                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <h1 className="text-md md:text-xl font-semibold">
                      {doctor.data.fullName}
                    </h1>
                    <FaShareAlt
                      onClick={handleCopyText}
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600"
                    />
                  </div>
                  <p
                    className="text-base font-semibold md:font-medium mt-1"
                    style={{ color: "#121414" }}
                  >
                    {renderSpecialist(doctor.data.specialization)}
                  </p>
                  <p className="text-sm" style={{ color: "#121414" }}>
                    {renderEducation(doctor.data.educations)}
                  </p>
                  <p className="text-sm mt-1 mb-1" style={{ color: "#121414" }}>
                    {doctor.data.workExperience} years experience overall
                  </p>
                  <p className="hidden md:flex text-gray-600 text-sm md:text-md items-center gap-2 mb-1 mt-2">
                    <BsPatchCheckFill className="text-green-500" />
                    Medical Registration Verified
                  </p>

                  <div
                    className={`flex align-center ${
                      doctor.data.reviewStats?.[0]
                        ? "justify-between"
                        : "justify-end"
                    }`}
                  >
                    {doctor.data.reviewStats?.[0] && (
                      <p className="flex items-center mt-3">
                        <span className="flex text-green-600 gap-2 text-base font-semibold">
                          <FaThumbsUp className="text-green-600 text-lg" />
                          {Math.round(
                            doctor.data.reviewStats[0]?.recommendationPercentage
                          )}
                          %
                        </span>
                        <span className="text-sm md:text-md text-gray-600 ml-2">
                          ({doctor.data.reviewStats[0]?.total} patients)
                        </span>
                      </p>
                    )}

                    <span
                      onClick={handlerShareReview}
                      className="hidden md:block cursor-pointer text-blue-600 font-medium hover:underline text-sm md:text-md"
                    >
                      Share your story
                    </span>
                  </div>
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

              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold">About</h2>
                <div
                  className="text-sm text-gray-700 mt-2"
                  dangerouslySetInnerHTML={{
                    __html: handleAbout(doctor.data.about),
                  }}
                />

                {/* Conditionally show Read More */}
                {wordCount > 30 && (
                  <div
                    className="text-sm font-bold mt-2 text-[#6b45c6] border-b border-[#6b45c6] inline-block cursor-pointer hover:opacity-80"
                    onClick={readMore}
                  >
                    {isredmore ? "Show Less" : "Read More"}
                  </div>
                )}

                {/* Tabs Section */}

                <TabComponent
                  handlerShareReview={handlerShareReview}
                  reviewList={reviewList}
                  doctor={doctor}
                  docId={docId}
                  tabValue={tabValue}
                />
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

          {showModal && (
            <LoginAlert setShowModal={setShowModal} handleLogin={handleLogin} />
          )}
        </div>
      )}
    </div>
  );
}
