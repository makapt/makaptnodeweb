"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SeachBar from "./section/SeachBar";
import FilterModal from "./section/FilterModal";
import doctorFactory from "@/actions/doctorAction";
import { MdArrowBack } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation"; // Import useRouter
import Breadcrumb from "./section/Breadcrumb";
import { filtersData } from "./mockData";
import DoctorCardList from "./section/DoctorCardList";
import {
  applyUnavailabilityToSchedule,
  formatSchedule,
  renderSpecialist,
} from "../../utils/helper";
import { useApplicationContext } from "@/context/ApplicationContext";
import { FiFilter } from "react-icons/fi";
import SearchBar from "@/components/mobileSearchBar/SearchBar";
import ScreenLoader from "@/components/ui/ScreenLoader";
import Link from "next/link";

export default function DoctorListingPage() {
  const { isLoggedInUser } = useApplicationContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  const filterKeys = ["experience", "availability", "gender", "fees"];

  const activeFilterCount = Array.from(params.entries()).filter(
    ([key, value]) => filterKeys.includes(key) && value
  ).length;

  const id = searchParams.get("id");

  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const itemsPerPage = 12;

  const [docList, setDocList] = useState({ data: [] });
  const [schedules, setSchedules] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortBy, setSortBy] = useState("none");

  const paramsObject = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const fetchData = useCallback(
    async (page) => {
      setLoader(true);
      const offset = page - 1;
      const result = await doctorFactory.getDoctorLists({
        ...paramsObject,
        itemsPerPage,
        offset,
        sortBy,
      });
      setDocList(result.data);
      setLoader(false);
    },
    [paramsObject, itemsPerPage, sortBy]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData, sortBy]);

  const sortByHandler = (e) => {
    setSortBy(e.target.value);
  };

  const handleBookAppointment = async (doctor) => {
    const unavailabilityData = await doctorFactory.getDoctorUnavailability({
      id: doctor.doctorId,
    });

    const res = formatSchedule(doctor?.schedules);
    const updatedSchedule = applyUnavailabilityToSchedule(
      res,
      unavailabilityData.data.data
    );
    setSchedules(updatedSchedule);
    setSelectedDoctor(doctor);
    setIsDrawerOpen(true);
    const firstAvailableIndex = res?.findIndex(
      (schedule) => schedule.times !== "Unavailable"
    );
    if (firstAvailableIndex !== -1) {
      setSelectedTab(firstAvailableIndex);
    }
  };

  const handleConfirmAppointment = () => {
    let route = "";
    if (isLoggedInUser) {
      route = `/appointment-summery?apptdate=${schedules[selectedTab].date}&id=${selectedDoctor.doctorId}`;
    } else {
      const queryParams = new URLSearchParams({
        redirectionURL: `/appointment-summery?apptdate=${schedules[selectedTab].date}&id=${selectedDoctor.doctorId}`,
      });
      route = `/getstarted?${queryParams.toString()}`;
    }
    return route;
  };

  const filterHandler = (filterName, filterValue, date_value) => {
    if (filterName === "availability") {
      params.set("availability_value", date_value);
      params.set(filterName, filterValue);
    } else {
      params.set(filterName, filterValue);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  function checkAvailability(schedule) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (schedule.date === todayStr) {
      // Get the last time slot's 'to' time
      const lastToTimeStr = schedule.times[schedule.times.length - 1].to;
      const lastToDate = new Date(`${schedule.date} ${lastToTimeStr}`);

      if (lastToDate < today) {
        return { availability: false };
      }
    }
    return { availability: true };
  }
  console.log("schedules", schedules);
  return (
    <div className="bg-white md:bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 ">
        <div className="flex gap-4 bg-white">
          <aside className="hidden md:block w-1/4 bg-white p-4 rounded   sticky top-4 h-fit">
            <h2 className="text-lg font-semibold">Find the Right Doctor</h2>
            <p className="text-gray-600 text-sm mb-0">
              Find top doctors and book appointments effortlessly.
            </p>
          </aside>

          {/* Main Section */}
          <div className="w-full p-0 md:p-4  block md:hidden">
            <SearchBar />
          </div>
          <SeachBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 flex gap-4">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-1/4 bg-white p-4 rounded shadow sticky top-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          {/* Selected Filters Display */}
          <div className="mb-4 flex flex-wrap gap-2">
            {filtersData.map((filter) => {
              const selectedValue = searchParams.get(filter.value);
              if (!selectedValue) return null;

              let selectedOption;
              selectedOption = filter.options.find(
                (option) => option.value === selectedValue
              );
              return selectedOption ? (
                <div
                  key={filter.value}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {selectedOption.label}
                  <button
                    onClick={() => filterHandler(filter.value, "", "")}
                    className="cursor-pointer ml-2 text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
              ) : null;
            })}
          </div>

          {filtersData.map((filter, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-gray-700">{filter.name}</h3>
              <div className="mt-2 space-y-2">
                {filter.options.map((option, idx) => {
                  const isChecked =
                    searchParams.get(filter.value) === option.value;
                  return (
                    <label
                      onClick={() =>
                        filterHandler(
                          filter.value,
                          option.value,
                          option.date_value
                        )
                      }
                      key={idx}
                      className="block text-sm"
                    >
                      <input
                        type="radio"
                        name={filter.value}
                        className="cursor-pointer mr-2"
                        checked={isChecked || false}
                        onChange={() => {}}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Section */}
        <main className="w-full md:w-3/4 space-y-4 bg-white p-0 md:p-4 rounded shadow-none md:shadow">
          <Breadcrumb />

          {/* Heading & Sort Option */}
          <div className=" bg-white flex flex-col md:flex-row justify-between items-center gap-2">
            {/* Title takes full width */}
            <h1 className="mb-3 text-xl font-semibold w-full">Find Doctors</h1>

            <div className="mb-3 w-full overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-visible md:whitespace-normal md:scrollbar-default md:w-auto">
              <div className="flex gap-3 w-max">
                <select
                  onChange={sortByHandler}
                  className="w-[100px] md:w-auto rounded-[25px] border border-blue-600 p-2 text-sm text-blue-600 font-medium"
                >
                  <option value="">Sort by</option>
                  <option value="yearOfExperience">
                    Experience: High to Low
                  </option>
                  <option value="highToLow">
                    Consultation Fee - High to Low
                  </option>
                  <option value="lowToHigh">
                    Consultation Fee - Low to High
                  </option>
                  <option value="mostLiked">Patient Review - Most Liked</option>
                </select>

                <div className="md:hidden">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-[25px] border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-all"
                  >
                    <span className="relative flex items-center gap-1">
                      <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                      <FiFilter className="text-blue-600 text-base" />
                    </span>
                    Filter
                  </button>
                </div>

                <div className="md:hidden">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-[25px] border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-all"
                  >
                    10+ Years of experience
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loader && <ScreenLoader />}

          {!loader && docList.data?.length === 0 && (
            <div className="mt-12 flex flex-col items-center text-center h-full">
              <div className="text-6xl mb-4 animate-bounce">🩺</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                No Doctors Found
              </h2>
              <p className="text-gray-600 mb-4 max-w-md">
                We couldn&apos;t find any doctors matching your search. Try
                adjusting your filters or search keywords.
              </p>
            </div>
          )}

          {!loader &&
            docList.data?.map((doctor, index) => (
              <DoctorCardList
                key={index}
                doctor={doctor}
                path={docList.path}
                handleBookAppointment={handleBookAppointment}
                slug={id}
              />
            ))}
        </main>
      </div>
      {isDrawerOpen && (
        <>
          {/* Overlay - Covers Entire Screen */}
          <div
            className="fixed inset-0 bg-[#121414]/50 z-[60]"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer - On Top of Everything */}
          <div
            className={`fixed top-0 right-0 h-full w-full max-w-[384px] bg-white border border-gray-300 transition-transform duration-300 transform ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            } z-[70]`}
          >
            {/* Header */}
            <div className="relative p-4 border-b border-gray-300 bg-white flex items-center">
              <button
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={() => setIsDrawerOpen(false)}
              >
                <MdArrowBack size={28} className="font-bold" />
              </button>
              <h2 className="text-xl font-semibold flex-1 text-center">
                Book Appointment
              </h2>
            </div>

            {selectedDoctor && (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {selectedDoctor.doctors?.fullName}
                </p>
                <p className="text-gray-600">
                  {renderSpecialist(selectedDoctor.specialization, id)}
                </p>
                {/* Date Selection Tabs */}
                <div className="mt-4 border-b border-gray-300 pb-2 flex gap-2 overflow-x-auto">
                  {schedules?.slice(0, 4).map((schedule, index) => {
                    return (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded transition-colors ${
                          schedule?.times === "Unavailable"
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Lighter gray for disabled
                            : selectedTab === index
                            ? "bg-blue-500 text-white cursor-pointer" // Active button
                            : "bg-gray-100 text-gray-800 cursor-pointer" // Unselected button
                        }`}
                        disabled={schedule?.times === "Unavailable"}
                        onClick={() => {
                          if (schedule?.times !== "Unavailable") {
                            setSelectedTab(index);
                          }
                        }}
                      >
                        <div className="w-10">{schedule.label}</div>
                      </button>
                    );
                  })}
                </div>
                {schedules?.[selectedTab]?.times !== "Unavailable" &&
                  schedules?.[selectedTab]?.times !== "Leave" && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Available Time</h3>
                      <div className="grid grid-cols-1">
                        {schedules[selectedTab]?.times.map((newItem, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 mb-4 mt-2"
                          >
                            <div className="font-medium">Shift {j + 1} : </div>
                            <button className="px-4 py-2 rounded transition-colors bg-gray-200">
                              {newItem.from} {" - "} {newItem.to}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {schedules?.[selectedTab]?.times === "Leave" && (
                  <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
                    <h3 className="font-semibold text-lg mb-2">
                      Doctor is on leave today
                    </h3>
                    {schedules[selectedTab]?.reason ? (
                      <p>Reason: {schedules[selectedTab].reason}</p>
                    ) : (
                      <p>The doctor is not available for appointments today.</p>
                    )}
                  </div>
                )}

                {checkAvailability(schedules?.[selectedTab]).availability &&
                schedules?.[selectedTab]?.times !== "Leave" ? (
                  <Link
                    href={handleConfirmAppointment()}
                    className="mt-4 w-full px-4 py-2 bg-green-500 text-white font-semibold rounded block text-center"
                  >
                    Confirm Appointment
                  </Link>
                ) : (
                  <div className="mt-4 w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded block text-center cursor-not-allowed">
                    Appointment Closed
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Mobile Filters Modal */}
      <FilterModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        filterHandler={filterHandler}
      />
    </div>
  );
}
