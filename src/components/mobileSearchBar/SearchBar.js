"use client";

import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import useDebouncedCallback from "@/hooks/useDebouncedCallback";
import homeFactory from "@/actions/homeAction";
import SearchList from "../home/section/SearchList";
import {
  FiArrowLeft,
  FiMapPin,
  FiSearch,
  FiChevronDown,
  FiNavigation,
} from "react-icons/fi";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { slugify } from "@/utils/helper";
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [speData, setSpeData] = useState({ data: [] });
  const [filteredOptions, setFilteredOptions] = useState({
    spe_list: [],
    doc_list: [],
  });
  const [isSearchInputClicked, setSearchInputClicked] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});

  console.log("search", search);

  const fetchData = async () => {
    const result = await homeFactory.getDefaultSpecialization();
    setSpeData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const debounced = useDebouncedCallback(async (searchQuery) => {
    if (searchQuery) {
      let result = await homeFactory.globalSearch({ query: searchQuery });
      if (result.status === 200) {
        setFilteredOptions({
          ...result.data,
          spe_list: [...result.data.spe_list, ...result.data.doc_list],
        });
      } else {
        console.error(result);
      }
    } else {
      setFilteredOptions({ spe_list: [], doc_list: [] });
    }
  }, 600);

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    debounced(value);
    setSearchQuery(value);
  };

  const handleBackClick = () => {
    setIsModalOpen(false);
  };

  const getCurrentLatLong = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const addressRes = await homeFactory.getAddressFromCoordinates(
              latitude,
              longitude
            );

            const fetchedAddress = addressRes.data.data[1]?.long_name;
            setLocationValue(fetchedAddress);
            setFilteredLocations([]);
            setSelectedLocation({
              address_line1: fetchedAddress,
              lat: latitude,
              lon: longitude,
            });
            localStorage.setItem(
              "userSelectedAddress",
              JSON.stringify({
                address_line1: fetchedAddress,
                lat: latitude,
                lon: longitude,
              })
            );
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
          if (error.code === error.PERMISSION_DENIED) {
            console.log(
              "Location permission denied. Please enable it in settings."
            );
          }
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem("userSelectedAddress");
    const parseAdd = JSON.parse(storedLocation);
    if (parseAdd) {
      setLocationValue(parseAdd.address_line1);
      setFilteredLocations([]);
      setSelectedLocation(parseAdd);
    } else {
      getCurrentLatLong();
    }
  }, []);

  const handleLocationChange = async (e) => {
    const text = e.target.value.trim();
    setLocationValue(text);
    const res = await homeFactory.autocomplete(text);
    setFilteredLocations(res.data.data.results || []);
  };

  const handleSelectFilter = (item) => {
    const queryParams = new URLSearchParams({
      type: item.name ? "specialization" : "doctor",
      address_line1: selectedLocation.address_line1 || "",
      lat: selectedLocation.lat || "",
      lng: selectedLocation.lon || "",
    });

    if (item.name) {
      queryParams.append("search", item.name);
      queryParams.append("slug", item.slugName);
      queryParams.append("id", item._id);
      router.push(`/doctors?${queryParams.toString()}`);
    } else {
      const slug = slugify(item.fullName);
      const joinNameId = slug + "-" + item._id;
      router.push(`/doctors/${joinNameId}?${queryParams.toString()}`);
    }
    setIsModalOpen(false);
  };

  const handleSelectLocation = (item) => {
    if (item === "current_location") {
      getCurrentLatLong();
    } else {
      setLocationValue(item.address_line1);
      setSelectedLocation(item);
    }
    setSearchInputClicked(true);
    setFilteredLocations([]);
    localStorage.setItem("userSelectedAddress", JSON.stringify(item));
  };

  return (
    <>
      <div
        onClick={() => {
          setIsModalOpen(true);
          setSearchInputClicked(false);
          setLocationValue(selectedLocation?.address_line1);
          setFilteredLocations([]);
        }}
        className="flex items-center gap-2 py-3 bg-white w-fit"
      >
        <FiMapPin className="text-blue-600 w-4 h-4" />
        <span className="text-sm font-medium text-gray-800">
          {selectedLocation?.address_line1 || "Your Location"}
        </span>
        <FiChevronDown className="text-gray-500 w-5 h-5" />
      </div>
      <div
        className="search-bar flex items-center justify-between bg-white border-[2px] border-[#4C4DDC] rounded-md px-4 py-2 shadow-sm cursor-pointer w-full max-w-full overflow-x-auto"
        role="button"
        onClick={() => {
          setIsModalOpen(true);
          setSearchInputClicked(true);
        }}
      >
        <div className="search-bar-text text-gray-500 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {search || "Search doctors, clinics, hospitals, etc"}
        </div>
        <MdSearch className="text-gray-500 w-7 h-7 flex-shrink-0 ml-2" />
      </div>

      {isModalOpen && (
        <div className="fixed left-0 right-0 bottom-0 top-[64px] z-[9999] bg-white flex flex-col">
          <div className="relative flex items-center justify-center py-4 border-b border-gray-200">
            <FiArrowLeft
              className="absolute left-4 text-gray-600 text-2xl cursor-pointer"
              onClick={handleBackClick}
            />

            <p className="text-lg font-medium text-gray-800">Search</p>
          </div>
          <div className="px-4 pt-4">
            <div className="relative flex items-center">
              <FiMapPin className="absolute left-3 text-gray-500 text-xl cursor-pointer" />
              <input
                type="text"
                placeholder="Search location"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                autoFocus={!isSearchInputClicked}
                value={locationValue}
                onChange={handleLocationChange}
                onFocus={() => setSearchInputClicked(false)}
              />
            </div>
          </div>
          <div className="px-4 pt-4">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 text-gray-500 text-xl cursor-pointer" />
              <input
                type="text"
                placeholder="Search Doctors, Specialities, Conditions etc."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                autoFocus={isSearchInputClicked}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchInputClicked(true)}
              />
            </div>
          </div>

          {!isSearchInputClicked ? (
            <div className="px-4 pt-4 flex-1 overflow-y-auto">
              <div
                className="w-full pt-4 pb-4 flex items-center gap-2 text-blue-600 font-medium text-sm cursor-pointer hover:underline w-fit border-b"
                style={{ borderBottom: "1px solid #e0e0e5" }}
                onClick={() => handleSelectLocation("current_location")}
              >
                <FiNavigation className="w-5 h-5" />
                <span>Use My Location</span>
              </div>

              <ul className="mt-4">
                {filteredLocations.map((loc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-6 py-4 cursor-pointer hover:bg-blue-100 text-gray-700 border-b border-gray-300 last:border-b-0"
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <div className="p-2 bg-gray-200 rounded-full">
                      <FiMapPin className="text-gray-600 w-4 h-4" />
                    </div>
                    {loc.address_line1}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-4 pt-4 flex-1 overflow-y-auto">
              <ul className="border border-gray-200 rounded-md">
                {filteredOptions.spe_list.length > 0
                  ? filteredOptions.spe_list.map((option, index) => (
                      <SearchList
                        option={option}
                        key={index}
                        handleSelectFilter={handleSelectFilter}
                        path={filteredOptions.path}
                      />
                    ))
                  : speData.data?.map((option, index) => (
                      <SearchList
                        option={option}
                        key={index}
                        handleSelectFilter={handleSelectFilter}
                        path={filteredOptions.path}
                      />
                    ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
