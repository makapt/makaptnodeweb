"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { businessName, formatNumber } from "../../utils/helper";
import aboutusbanner from "@/assets/img/aboutusbanner.png";
import Image from "next/image";

const About = ({ homeData }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden"
      id="About"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-2">
        About{" "}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          MAKAPT
        </span>
      </h1>
      <p className="text-gray-500 max-w-80 text-center mb-8">
        Effortless Appointments, Exceptional Service
      </p>

      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-20">
        <Image
          src={aboutusbanner}
          alt="About Us Banner"
          width={500}
          height={300}
          className="w-full sm:w-1/2 max-w-lg"
        />
        <div className="flex flex-col items-center md:items-start mt-10 text-gray-600">
          <div className="grid grid-cols-2 gap-6 md:gap-10 w-full 2xl:pr-28">
            <div>
              <p className="text-4xl font-medium text-gray-800">
                {formatNumber(homeData?.trustedDoctor || 0)}+
              </p>
              <p>Trusted Doctors</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-gray-800">
                {formatNumber(homeData?.satisfiedPatient || 0)}+
              </p>
              <p>Satisfied Patients</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-gray-800">9/10 *</p>
              <p>Highly Rated by Patients</p>
            </div>
          </div>
          <p className="my-10 max-w-lg">
            At <span className="font-bold">{businessName}</span>, we make
            healthcare simple and accessible. Our online booking platform allows
            you to schedule doctor appointments at your convenience, saving you
            time and eliminating long waiting hours. Whether you need a routine
            checkup or specialized care, we connect you with our experienced
            healthcare professionals seamlessly. With just a few clicks, you can
            secure your appointment at a time that works best for you.
            <br />
            <br />
            We prioritize your health and privacy, offering a safe and efficient
            way to receive the care you deserve. Book your appointment with us
            today and experience hassle-free healthcare at{" "}
            <span className="font-bold">{businessName}</span>.
          </p>
          <button
            onClick={() => router.push("/about")}
            className="bg-blue-600 text-white px-8 py-2 rounded"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
