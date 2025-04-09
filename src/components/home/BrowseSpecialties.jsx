import Link from "next/link";
import homeFactory from "@/actions/homeAction";
import { useEffect, useState } from "react";
import CacheImage from "../ui/cacheImage";
import ScreenLoader from "@/components/ui/ScreenLoader";
import useDeviceType from "@/hooks/useDeviceType";

export default function BrowseSpecialties({ selectedLocation }) {
  const { isMobile } = useDeviceType();
  const [speData, setSpeData] = useState({ data: [] });
  const [loader, setLoader] = useState(false);

  const fetchData = async () => {
    try {
      setLoader(true);
      const result = await homeFactory.getAllSpecialization(20, 0);
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
    <section className="max-w-7xl mx-auto py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg sm:text-2xl font-semibold">
          Browse by Specialties
        </h2>
        <Link href="/find-doctors">
          <span className="text-blue-600 text-sm font-medium border-b-2 border-blue-600 hover:text-blue-700 hover:border-blue-700 transition cursor-pointer">
            View All
          </span>
        </Link>
      </div>
      {loader && <ScreenLoader />}
      {/* Grid Layout */}
      <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6 justify-items-center">
        {speData.data
          ?.slice(0, isMobile ? 8 : speData.data.length)
          .map((specialty, index) => (
            <div key={index} className="">
              <Link
                href={`doctors?type=specialization&address_line1=${selectedLocation.address_line1}&lat=${selectedLocation.lat}&lng=${selectedLocation.lon}&search=${specialty.name}&slug=${specialty.slugName}&id=${specialty._id}`}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-16 h-16 md:w-22 md:h-22 rounded-full overflow-hidden bg-[#f6f6f6] p-3">
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
