"use client";

import { useEffect, useState } from "react";
import apiFactory from "@/actions/apiAction";
import QuesList from "./QuesList";

const FAQs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getPageData = async () => {
      try {
        const res = await apiFactory.getFAQ();
        setData(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setData([]); // Fallback to empty array
      }
    };

    getPageData();
  }, []);

  return (
    <div className="pt-24 container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        How can we help you?
      </h1>
      <p className="text-gray-500 text-center mb-8 mt-2 text-lg">
        We are here to answer all your Frequently Asked Questions
      </p>

      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-20">
        <div className="w-full">
          <QuesList data={data} />
        </div>
      </div>
    </div>
  );
};

export default FAQs;
