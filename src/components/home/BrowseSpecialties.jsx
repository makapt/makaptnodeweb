import Link from "next/link";
import homeFactory from "@/actions/homeAction";
import { useEffect, useState } from "react";
import CacheImage from "../ui/cacheImage";
import ScreenLoader from "@/components/ui/ScreenLoader";

export default function BrowseSpecialties({ selectedLocation }) {
  const [speData, setSpeData] = useState({ data: [] });
  const [loader, setLoader] = useState(false);

  const fetchData = async () => {
    try {
      setLoader(true);
      const result = await homeFactory.getAllSpecialization(12, 0);
      setSpeData(result.data);
    } catch (e) {
      console.log("e", e);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg sm:text-2xl font-semibold">
          Browse by Specialties
        </h2>
        <Link href="/find-doctors">
          <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 transition">
            View All
          </button>
        </Link>
      </div>
      {loader && <ScreenLoader />}
      {/* Grid Layout */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {speData.data?.map((specialty, index) => (
          <div key={index} className="flex flex-col items-center">
            <Link
              href={`doctors?type=specialization&address_line1=${selectedLocation.address_line1}&lat=${selectedLocation.lat}&lng=${selectedLocation.lon}&search=${specialty.name}&slug=${specialty.slugName}&id=${specialty._id}`}
              className="cursor-pointer"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                <CacheImage
                  path={speData.path}
                  src={specialty.image}
                  width={120}
                  height={120}
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
