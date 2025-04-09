"use client";

import React, { useEffect, useState } from "react";
import apiFactory from "../../actions/apiAction";
import { formatNumber } from "../../utils/helper";
import Link from "next/link";

const About = () => {
  const [data, setData] = useState("");
  const [homeData, setHome] = useState({});

  const getPageData = async () => {
    const res = await apiFactory.getStaticPage("aboutUs");
    const homeRes = await apiFactory.getHome();
    setHome(homeRes.data);
    setData(res.data.data.content);
  };

  useEffect(() => {
    getPageData();
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-2 text-lg">
          Your Health. Our Priority. Empowering Wellness, One Step at a Time.
        </p>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16 text-center grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <p className="text-4xl font-bold text-blue-600">
            {formatNumber(homeData.satisfiedPatient)}+
          </p>
          <p className="text-gray-700">Satisfied Patients</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <p className="text-4xl font-bold text-blue-600">
            {formatNumber(homeData.trustedDoctor)}+
          </p>
          <p className="text-gray-700">Trusted Doctors</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <p className="text-4xl font-bold text-blue-600">9/10*</p>
          <p className="text-gray-700">Highly Rated by Patients</p>
        </div>
      </div>

      {/* About Us Content */}
      <div className="container mx-auto px-6 ">
        <div className="bg-white p-8 rounded-lg shadow-lg text-gray-700 leading-relaxed">
          <div
            className="staticContentWrapper"
            dangerouslySetInnerHTML={{ __html: data }}
          ></div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white text-center py-16">
        <h2 className="text-3xl font-bold">
          Join Our Mission for Better Healthcare
        </h2>
        <p className="mt-2 text-lg">
          Book an appointment with top doctors or subscribe for the latest
          health updates.
        </p>
        <Link href="/getstarted">
          <button className="mt-6 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
