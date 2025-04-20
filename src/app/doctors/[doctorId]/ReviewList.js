import React, { useState } from "react";
import { formatFullDate } from "@/utils/helper";
import useDeviceType from "@/hooks/useDeviceType";

export default function ReviewList({
  handlerShareReview,
  reviewList,
  doctor,
  activeTab,
  handlerTab,
}) {
  const { isMobile } = useDeviceType();

  const [expanded, setExpanded] = useState(false);

  if (reviewList.data.length === 0 && activeTab !== "review") {
    return "";
  }

  return (
    <div className="mt-8">
      {reviewList.data.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-3 text-[#6b45c6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.27-3.81A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Be the first to share your experience.
          </p>

          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer bg-[#6b45c6] hover:bg-[#5938b0] text-white text-sm font-medium px-4 py-2 rounded-md transition-all"
              onClick={handlerShareReview}
            >
              Share Your Story
            </button>
          </div>
        </div>
      )}

      {reviewList.data.length > 0 && (
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {isMobile
            ? "Patient Stories"
            : `Patient Reviews for ${doctor.data.fullName}`}
        </h2>
      )}

      <div className="mt-8 space-y-6">
        {reviewList.data.map((r, i) => (
          <div key={i} className={`pb-6 border-b border-gray-200`}>
            {/* Header: Avatar + Name + Time */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#6b45c6] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {r.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#737382]">
                    {r.fullName}{" "}
                    {r.verified && (
                      <span className="text-sm text-green-600 font-medium">
                        (Verified)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {formatFullDate(new Date(r.createdAt))}
              </p>
            </div>

            {/* Visit Reason */}
            <p className="text-base text-gray-700 mt-4 mb-2 font-medium">
              Visited For {r.specialization.name}
            </p>

            {/* Recommendation */}
            {r.recommendation === "yes" && (
              <p className="text-sm font-semibold text-green-700 mb-2">
                👍 I recommend the doctor
              </p>
            )}

            {/* Happy With as Button-style Pills */}
            <div className="mb-4 mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Happy with:
              </p>
              <div className="flex flex-wrap gap-2">
                {r.mostHappyWith.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-md bg-[#f3f0ff] text-[#6b45c6] font-medium border border-[#e0dcfa]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Content */}
            <p className="text-sm text-gray-800">
              {expanded ? r.desc : `${r.desc.substring(0, 150)}...`}
            </p>

            {/* Toggle */}
            {r.desc.length > 150 && (
              <button
                className="text-sm text-[#6b45c6] font-semibold mt-1"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Shrink" : "Show More"}
              </button>
            )}
          </div>
        ))}

        {reviewList.total > 5 && activeTab !== "review" && (
          <span
            onClick={() => handlerTab("review")}
            className="hidden md:block cursor-pointer text-blue-600 font-semibold hover:underline text-sm md:text-md"
          >
            Show all stories ({reviewList.total})
          </span>
        )}
      </div>

      <div className="flex md:hidden justify-between gap-2">
        <button
          className="w-1/2 cursor-pointer bg-[#6b45c6] hover:bg-[#5938b0] text-white text-sm font-medium px-4 py-2 rounded-md transition-all"
          onClick={handlerShareReview}
        >
          Share Your Story
        </button>
        <button
          className="w-1/2 cursor-pointer bg-[#6b45c6] hover:bg-[#5938b0] text-white text-sm font-medium px-4 py-2 rounded-md transition-all"
          // onClick={handlerShareReview}
        >
          Read {reviewList.total} Stories
        </button>
      </div>
    </div>
  );
}
