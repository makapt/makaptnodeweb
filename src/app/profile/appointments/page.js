"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import appointmentFactory from "@/actions/appointmentAction";
import Link from "next/link";
import CacheImage from "@/components/ui/cacheImage";
import ScreenLoader from "@/components/ui/ScreenLoader";
import CustomPagination from "@/components/pagination/customPagination";
import { formattedDate } from "@/utils/helper";

export default function ProfilePage() {
  const router = useRouter();
  const [apptList, setApptList] = useState({ data: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState();
  const [loader, setLoader] = useState(false);
  const itemsPerPage = 12;

  const fetchData = useCallback(
    async (page) => {
      setApptList({ data: [], total: 0 });
      setLoader(true);
      const offset = page - 1;
      const result = await appointmentFactory.getAppointments({
        limit: itemsPerPage,
        page: offset,
        apptType: sortBy,
      });
      setApptList(result.data);
      setLoader(false);
    },
    [itemsPerPage, sortBy]
  ); // ✅ include dependencies used inside the function

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  const totalPages = Math.ceil(apptList.total / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusStyles = {
      cancelled: "bg-[rgba(255,44,0,0.1)] text-[#ff2c00]",
      completed: "bg-[#28a745] text-[#fff]",
      pending: "bg-[rgba(255,165,0,0.1)] text-[#ffa500]",
    };

    return (
      <span
        className={`px-2 py-1 rounded-sm text-[12px] ${
          statusStyles[status] || "bg-gray-200 text-gray-600"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const rebookHandler = (item) => {
    const queryParams = new URLSearchParams({
      type: "doctor",
      id: item.doctorId,
    });
    router.push(
      `/doctors/${item.doctorDetails.fullName}?${queryParams.toString()}`
    );
  };

  const sortByHandler = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="px-4 py-4 mt-4 md:mt-0">
      <div className="flex gap-2 items-center justify-between mb-4 px-2 md:px-0">
        <h2 className="text-lg font-semibold ">Total: {apptList.total}</h2>

        <select
          onChange={sortByHandler}
          className="md:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {loader && <ScreenLoader />}

      {apptList?.data.map((item, i) => (
        <div
          key={i}
          className="mb-4 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm md:text-base font-semibold">
              Appointment ID #{item.apptID}
            </span>
            {getStatusBadge(item.apptStatus)}
          </div>

          <div className="cursor-pointer flex md:flex-row gap-4 md:gap-6">
            <div className="md:w-20 h-auto md:h-20 mb-4 md:mb-0 flex items-start">
              <CacheImage
                path={apptList.path}
                src={item?.profiles?.[0]?.image || item.doctorDetails.image}
                width={70}
                height={70}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold mb-1">
                <Link
                  href={`/profile/appointments/${item._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.doctorDetails.fullName}
                </Link>
              </h2>
              <p className="text-sm mb-1">{item.doctorDetails.clinicName}</p>
              <p className="text-sm mb-2">
                <FaMapMarkerAlt className="inline-block text-red-500" />{" "}
                {item.doctorDetails.address.city},{" "}
                {item.doctorDetails.address.state}
              </p>
            </div>
          </div>

          <div className="block md:flex justify-between mt-3 gap-2">
            <div>
              <p className="text-sm md:text-base mb-1 flex items-center gap-3">
                <FaUser className="text-green-500 text-base md:text-lg" />
                {item.patientInfo.patientName},{" "}
                {item.patientInfo.gender.charAt(0).toUpperCase() +
                  item.patientInfo.gender.slice(1)}
                , {item.patientInfo.age} Yrs
              </p>
              <p className="text-sm md:text-base mb-1 flex items-center gap-3">
                <FaCalendarAlt className="text-blue-500 text-base md:text-lg" />
                {formattedDate(item.appointmentDate)} | W.No {item.waitingList}
              </p>
            </div>
            <div className="flex justify-between mt-4 gap-2">
              <button
                onClick={() => rebookHandler(item)}
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Rebook Appointment
              </button>
              {item.apptStatus === "pending" && (
                <button className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">
                  Direction
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {totalPages > itemsPerPage && (
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
