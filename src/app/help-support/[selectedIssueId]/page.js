"use client";

import profileFactory from "@/actions/profileAction";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiPhoneCall } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import authFactory from "@/actions/authAction";
import { FiArrowLeft } from "react-icons/fi";

export default function HelpSupport() {
  const router = useRouter();
  const { selectedIssueId } = useParams();
  const [faqData, setFaqData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [isDisLiked, setDisLiked] = useState(false);
  const [supportNo, setSupportNo] = useState("");

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const getFaqs = await profileFactory.appGetSelectedIssue(selectedIssueId);
      setFaqData(getFaqs.data.data);
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  }, [selectedIssueId]); // ✅ Include any variable used inside

  const fetchSupportNo = useCallback(async () => {
    const res = await authFactory.getSupportNo();
    setSupportNo(res.data.data.accountSupport);
  }, []); // ✅ No dependencies used inside

  useEffect(() => {
    fetchSupportNo();
    fetchList();
  }, [fetchSupportNo, fetchList]);

  const handlePhone = () => {
    window.open(`tel:${supportNo}`);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <button
        onClick={goBack}
        className="md:hidden flex items-center text-blue-600 hover:text-blue-800 text-md font-medium"
      >
        <FiArrowLeft className="mr-1 h-5 w-5" />
        Back
      </button>
      <div className="max-w-2xl mx-auto bg-white">
        {faqData.category !== "selectedAppointment" && (
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {faqData.categoryValue}
          </h2>
        )}

        <h3 className="text-xl font-semibold text-gray-900 mt-4">
          {faqData.question}
        </h3>

        <div
          className="text-gray-600 mt-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: faqData.answer }}
        />

        {/* Feedback Section */}
        <hr className="my-6" />
        <h4 className="text-lg font-medium text-center">
          Was this article useful?
        </h4>

        {/* Like/Dislike Buttons */}
        <div className="flex justify-center items-center gap-6 mt-6">
          <button
            onClick={() => !isDisLiked && setLiked(true)}
            className={`p-2 rounded-full ${
              isLiked ? "text-blue-600" : "text-black-400"
            } hover:text-blue-500 transition`}
          >
            <FaThumbsUp size={24} />
          </button>
          <button
            onClick={() => !isLiked && setDisLiked(true)}
            className={`p-2 rounded-full ${
              isDisLiked ? "text-red-600" : "text-black-400"
            } hover:text-red-500 transition`}
          >
            <FaThumbsDown size={24} />
          </button>
        </div>

        {/* Dislike Feedback */}
        {isDisLiked && (
          <div className="mt-10 text-center">
            <p className="text-gray-700 mb-4">Need more help?</p>
            <button
              onClick={handlePhone}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FiPhoneCall className="inline-block mr-2" />
              Call With Us
            </button>
          </div>
        )}

        {/* Like Thank You */}
        {isLiked && (
          <div className="mt-10 text-center">
            <p className="text-gray-700">Thank you for your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
}
