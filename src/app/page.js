"use client";
import Services from "@/components/home/Services";
import BrowseSpecialties from "@/components/home/BrowseSpecialties";
import DownloadApp from "@/components/home/DownloadApp";
import HomeSearchBox from "@/components/home/section/HomeSearchBox";
import { useState } from "react";
import SearchBar from "@/components/mobileSearchBar/SearchBar";
import useDeviceType from "@/hooks/useDeviceType";

export default function Home() {
  const { isMobile } = useDeviceType();
  const [selectedLocation, setSelectedLocation] = useState({});
  console.log("selectedLocation", selectedLocation);
  return (
    <>
      <div className="">
        <div className="w-full p-4 block md:hidden">
          <SearchBar />
        </div>
        <div
          className="relative bg-cover bg-center text-center text-white h-[120px] md:h-[220px]"
          style={{
            backgroundImage: isMobile
              ? "url('/2.png')"
              : "linear-gradient(120deg, #005cbf 0%, #396cf000 100%), url('/2.png')",
          }}
        >
          <div className="hidden md:flex relative z-10 flex-col items-center h-full">
            <h2 className="text-3xl sm:text-2xl font-semibold max-w-3xl mt-8">
              Make Your Appointment Easier
            </h2>

            <div className="flex absolute bottom-[55px] md:bottom-[48px] w-full justify-center px-4">
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
