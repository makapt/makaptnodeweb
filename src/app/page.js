"use client";
import Head from "next/head";
import Services from "@/components/home/Services";
import BrowseSpecialties from "@/components/home/BrowseSpecialties";
import DownloadApp from "@/components/home/DownloadApp";
import HomeSearchBox from "@/components/home/section/HomeSearchBox";
import { useState } from "react";

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState({});
  return (
    <>
      <Head>
        <title>Home | Best Doctors in Your City</title>
        <meta
          name="description"
          content="Find top-rated doctors and book appointments easily."
        />
      </Head>

      <div className="pt-20">
        <div
          className="relative bg-cover bg-center text-center text-white"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #005cbf 0%, #396cf000 100%), url('/2.png')",
            height: "380px",
          }}
        >
          <div className="relative z-10 flex flex-col items-center h-full">
            <h2 className="text-3xl sm:text-3xl md:text-5xl font-semibold max-w-3xl mt-10">
              Make Your Appointment Easier
            </h2>

            <div className="absolute bottom-[55px] md:bottom-[80px] w-full flex justify-center px-4">
              <HomeSearchBox
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            </div>
          </div>
        </div>
        <BrowseSpecialties selectedLocation={selectedLocation} />
        <Services />
        <DownloadApp />
      </div>
    </>
  );
}
