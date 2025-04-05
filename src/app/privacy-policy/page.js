"use client";

import { useEffect, useState } from "react";
import apiFactory from "@/actions/apiAction";

const PrivacyPolicy = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    const getPageData = async () => {
      try {
        const res = await apiFactory.getStaticPage("privacyPolicy");
        setData(res?.data?.data?.content || "No content available.");
      } catch (error) {
        console.error("Error fetching Privacy Policy:", error);
      }
    };

    getPageData();
  }, []);

  return (
    <div className="pt-24 container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 mt-8 text-center">
        Privacy Policy
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-10">
        <div className="text-gray-600 w-full">
          <div
            className="staticContentWrapper"
            dangerouslySetInnerHTML={{ __html: data }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
