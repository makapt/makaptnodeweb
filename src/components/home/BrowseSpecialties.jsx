import Link from "next/link";
import homeFactory from "@/actions/homeAction";
import { useEffect, useState } from "react";

export default function BrowseSpecialties({ selectedLocation }) {
  const [speData, setSpeData] = useState({ data: [] });

  const fetchData = async () => {
    const result = await homeFactory.getAllSpecialization(12, 0);
    setSpeData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Browse by Specialties
        </h2>
        <Link href="/find-doctors">
          <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 transition">
            View All
          </button>
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {speData.data?.map((specialty, index) => (
          <div key={index} className="flex flex-col items-center">
            <Link
              href={`doctors?type=specialization&address_line1=${selectedLocation.address_line1}&lat=${selectedLocation.lat}&lng=${selectedLocation.lon}&search=${specialty.name}&slug=${specialty.slugName}&id=${specialty._id}`}
              className="cursor-pointer"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg border-2 border-gray-200">
                <img
                  src={speData.path + specialty.image}
                  alt={specialty.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-3 text-center text-gray-800 text-sm md:text-base font-medium">
                {specialty.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
