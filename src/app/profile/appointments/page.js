"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import appointmentFactory from "@/actions/appointmentAction";
import ScreenLoader from "@/components/ui/ScreenLoader";
import CustomPagination from "@/components/pagination/customPagination";
import { slugify } from "@/utils/helper";
import Card from "./section/Card";
import PendingCard from "./section/PendingCard";

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
  );

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

  const slugifyurl = (fullName, doctorId) => {
    const slug = slugify(fullName);
    const joinNameId = slug + "-" + doctorId;
    return joinNameId;
  };

  const rebookHandler = (item) => {
    router.push(
      `/doctors/${slugifyurl(
        item.doctorDetails.fullName,
        item.doctorId
      )}?type=doctor`
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

      {apptList?.data.map((item, i) =>
        item?.status === "pending" ? (
          <PendingCard
            key={i}
            item={item}
            path={apptList.path}
            slugifyurl={slugifyurl}
          />
        ) : (
          <Card
            key={i}
            item={item}
            path={apptList.path}
            rebookHandler={rebookHandler}
            getStatusBadge={getStatusBadge}
          />
        )
      )}
      {apptList.total > itemsPerPage && (
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
