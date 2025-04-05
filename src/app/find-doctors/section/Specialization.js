import React, { useEffect, useState } from "react";
import Link from "next/link";
import homeFactory from "@/actions/homeAction";
import CacheImage from "@/components/ui/cacheImage";

export default function Specialization({ selectedLocation = {} }) {
  const [speData, setSpeData] = useState({ data: [] });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchData = async (page) => {
    const offset = page - 1;
    const result = await homeFactory.getAllSpecialization(itemsPerPage, offset);
    setSpeData(result.data);
    setTotalCount(result.data.total);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Browse by Specialties
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {speData.data?.map((specialty, index) => (
          <div key={index} className="flex flex-col items-center">
            <Link
              href={`doctors?type=specialization&address_line1=${selectedLocation.address_line1}&lat=${selectedLocation.lat}&lng=${selectedLocation.lon}&search=${specialty.name}&slug=${specialty.slugName}&id=${specialty._id}`}
              className="cursor-pointer"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg border-2 border-gray-200">
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
