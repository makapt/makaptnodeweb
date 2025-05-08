import React, { useState } from "react";
import ReviewList from "./ReviewList";
import { useParams, useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openSlider = (i) => {
    setIndex(i);
    setOpen(true);
  };

  const handlerTab = (tab) => {
    router.push(`/doctors/${doctorId}?type=doctor&tab=${tab}`);
  };

  const openMaps = (lat, lng) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const appleMapsUrl = `http://maps.apple.com/?q=${lat},${lng}`;

    if (isIOS) {
      window.location.href = appleMapsUrl;
    } else if (isAndroid) {
      window.location.href = googleMapsUrl;
    } else {
      window.open(googleMapsUrl, "_blank");
    }
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
          <div className="mt-6 p-0 md:p-4" id="education">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Clinic/Hospital Detail
            </h2>

            <p className="text-md font-semibold text-blue-700 mt-2">
              {doctor.data.clinicName}
            </p>
            <p className="text-gray-700 mt-2">
              {doctor.data.address.formatted_address}
            </p>
            <p>
              <button
                onClick={() =>
                  openMaps(
                    doctor.data.location.coordinates[1],
                    doctor.data.location.coordinates[0]
                  )
                }
                className="text-sm cursor-pointer text-blue-600 hover:border-b-1 border-blue-600"
              >
                Get Directions
              </button>
            </p>
            {doctor?.data?.clinicimages?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {doctor?.data?.clinicimages.slice(0, 3).map((img, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 shadow shrink-0 cursor-pointer"
                    onClick={() => openSlider(i)}
                  >
                    <img
                      src={doctor?.path + img.filename}
                      alt={`Clinic ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}

                {doctor?.data?.clinicimages?.length > 4 ? (
                  <div
                    className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700 shadow shrink-0 cursor-pointer"
                    onClick={() => openSlider(3)}
                  >
                    +{doctor?.data?.clinicimages?.length - 3}
                  </div>
                ) : (
                  doctor?.data?.clinicimages?.length === 4 && (
                    <div
                      className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 shadow shrink-0 cursor-pointer"
                      onClick={() => openSlider(3)}
                    >
                      <img
                        src={
                          doctor?.path + doctor?.data?.clinicimages[3].filename
                        }
                        alt="Clinic 4"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            )}

            {open && (
              <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={doctor?.data?.clinicimages.map((src) => ({
                  src: doctor?.path + src.filename,
                }))}
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
              />
            )}
          </div>
          <ReviewList
            reviewList={reviewList}
            doctor={doctor}
            activeTab={tabValue}
            docId={docId}
            handlerShareReview={handlerShareReview}
            handlerTab={handlerTab}
          />

          {/* Education */}
          <div className="mt-6 p-0 md:p-4" id="education">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Education & Training
            </h2>

            {doctor.data.educations.map((edu, index) => (
              <p className="text-md text-gray-700 mt-2" key={index}>
                <strong>{edu.degree}</strong> at {edu.school}
              </p>
            ))}
          </div>

          {/* Experience */}
          <div className="mt-6 p-0 md:p-4" id="experience">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Experience
            </h2>

            {doctor.data.experiences.map((exp, index) => (
              <p className="text-md text-gray-700 mt-2" key={index}>
                <strong>{exp.title}</strong> at {exp.clinicName}
              </p>
            ))}
          </div>

          {/* Languages */}
          <div className="mt-6 p-0 md:p-4" id="info">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Languages Spoken
            </h2>
            <p className="text-md text-gray-700 mt-2">Hindi, English</p>
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
