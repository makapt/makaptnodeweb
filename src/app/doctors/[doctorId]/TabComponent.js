import React from "react";
import { FaHospital, FaLanguage, FaUserMd } from "react-icons/fa";
import ReviewList from "./ReviewList";
import { useParams, useRouter } from "next/navigation";

const tabList = [
  { label: "Info", value: "info" },
  { label: "Patient Review", value: "review" },
];

export default function TabComponent({
  handlerShareReview,
  reviewList,
  doctor,
  docId,
  tabValue,
}) {
  const router = useRouter();
  const { doctorId } = useParams();

  const handlerTab = (tab) => {
    router.push(`/doctors/${doctorId}?type=doctor&tab=${tab}`);
  };

  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="hidden md:block flex space-x-4 border-b border-gray-300 mb-4">
        {tabList.map((tab, i) => {
          const isActive = tabValue === tab.value;
          return (
            <button
              key={i}
              onClick={() => {
                handlerTab(tab.value);
              }}
              className={`cursor-pointer px-6 py-2 text-md font-semibold rounded-t-md transition-all duration-200 ${
                isActive
                  ? "text-white bg-[#6b45c6] shadow-sm"
                  : "text-gray-600 hover:text-[#6b45c6] hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabValue !== "review" && (
        <>
          <ReviewList
            reviewList={reviewList}
            doctor={doctor}
            activeTab={tabValue}
            docId={docId}
            handlerShareReview={handlerShareReview}
            handlerTab={handlerTab}
          />

          {/* Education */}
          <div className="mt-6 p-4" id="education">
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

          {/* Experience */}
          <div className="mt-6 p-4" id="experience">
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

          {/* Languages */}
          <div className="mt-6 p-4" id="info">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaLanguage className="text-purple-500" /> Languages Spoken
            </h2>
            <p className="text-gray-700 mt-2">Hindi, English</p>
          </div>
        </>
      )}
      {tabValue === "review" && (
        <ReviewList
          handlerShareReview={handlerShareReview}
          reviewList={reviewList}
          doctor={doctor}
          activeTab={tabValue}
          docId={docId}
          handlerTab={handlerTab}
        />
      )}
    </div>
  );
}
