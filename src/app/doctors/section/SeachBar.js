"use client";

import { useState } from "react";
import HomeSearchBox from "@/components/home/section/HomeSearchBox";

export default function SeachBar() {
  const [selectedLocation, setSelectedLocation] = useState({});

  return (
    <main className="w-full md:w-3/4 bg-white p-4 rounded  ">
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-4 md:gap-6">
        <HomeSearchBox
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>
    </main>
  );
}
