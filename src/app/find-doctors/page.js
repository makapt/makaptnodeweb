"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import DownloadApp from "@/components/home/DownloadApp";
import Link from "next/link";
import Specialization from "./section/Specialization";
import HomeSearchBox from "@/components/home/section/HomeSearchBox";
import homeFactory from "@/actions/homeAction";

export default function FindDoctor() {
  const [selectedLocation, setSelectedLocation] = useState({});
  const [speData, setSpeData] = useState({ data: [] });

  const fetchData = async () => {
    const result = await homeFactory.getDefaultSpecialization();
    setSpeData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Find a Doctor | Book Appointments Online</title>
        <meta
          name="description"
          content="Find top-rated doctors and book appointments easily."
        />
      </Head>

      <div className="pt-20">
        {/* 🔹 Banner Section */}
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
              Find the Best Doctors & Book Instantly
            </h2>

            {/* 🔹 Search Box */}
            <div className="absolute bottom-[55px] md:bottom-[80px] w-full flex justify-center px-4">
              <HomeSearchBox
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            </div>
          </div>
        </div>

        {/* 🔹 Sidebar */}
        <div className="max-w-7xl mx-auto p-4 flex gap-4">
          <aside className="hidden md:block w-1/4 bg-white p-4 rounded shadow sticky top-4 h-fit">
            <h2 className="text-lg font-semibold mb-3">Popular Specialties</h2>
            <ul className="text-gray-700 space-y-2">
              {speData.data?.map((item, i) => {
                return (
                  <li key={i}>
                    <Link
                      href={`doctors?type=specialization&address_line1=${selectedLocation.address_line1}&lat=${selectedLocation.lat}&lng=${selectedLocation.lon}search=${item.name}&slug=${item.slugName}&id=${item._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-3">Health Tips</h2>
            <p className="text-gray-600 text-sm">
              Read the latest health blogs and expert advice.
            </p>
          </aside>

          {/* 🔹 Main Content */}
          <main className="w-full md:w-3/4 bg-white p-4 rounded shadow">
            <Specialization selectedLocation={selectedLocation} />
          </main>
        </div>

        <DownloadApp />
      </div>
    </>
  );
}
