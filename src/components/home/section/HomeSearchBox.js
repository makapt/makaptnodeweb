"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import homeFactory from "@/actions/homeAction";
import useDebouncedCallback from "@/hooks/useDebouncedCallback";
import SearchList from "./SearchList";
import { slugify } from "@/utils/helper";
import { getUserLocation } from "@/utils/getUserLocation";

export default function HomeSearchBox({
  selectedLocation,
  setSelectedLocation,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const search = searchParams.get("search");
  const city = searchParams.get("city");

  const [speData, setSpeData] = useState({ data: [] });
  const [filteredOptions, setFilteredOptions] = useState({
    spe_list: [],
    doc_list: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationValue, setLocationValue] = useState(city || "");
  const [searchValue, setSearchValue] = useState(search || "");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Restore saved location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");

    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      setLocationValue(parsed.city);
      setSelectedLocation(parsed);
    } else {
      getUserLocation()
        .then((location) => {
          localStorage.setItem("selectedLocation", JSON.stringify(location));
          setLocationValue(location.city);
          setSelectedLocation(location);
        })
        .catch((err) => {
          console.warn("Could not get user location:", err);
        });
    }
  }, []);

  const fetchData = async () => {
    const result = await homeFactory.getDefaultSpecialization();
    setSpeData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLocationChange = (e) => {
    const text = e.target.value;
    setLocationValue(text);
    fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&limit=5&format=json&filter=countrycode:in&apiKey=1aa33c1c139b45bb9e74c15ca565275e`
    )
      .then((res) => res.json())
      .then((res) => {
        setFilteredLocations(res.results || []);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

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
    setSearchValue(value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowLocationDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectFilter = (item) => {
    const queryParams = new URLSearchParams({
      type: item.name ? "specialization" : "doctor",
      city: selectedLocation.city || "",
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
    setShowDropdown(false);
  };

  const handleSelectLocation = (item) => {
    if (item === "current_location") {
      getUserLocation()
        .then((location) => {
          localStorage.setItem("selectedLocation", JSON.stringify(location));
          setLocationValue(location.city);
          setSelectedLocation(location);
        })
        .catch((err) => {
          console.warn("Could not get user location:", err);
        });
    } else {
      const loc = {
        lat: item.lat,
        lon: item.lon,
        city: item.city,
      };

      setLocationValue(loc.city);
      setSelectedLocation(loc);
      localStorage.setItem("selectedLocation", JSON.stringify(loc));
    }
    setShowLocationDropdown(false);
    setShowDropdown(true);
  };

  return (
    <div
      className="bg-white rounded-lg flex flex-col md:flex-row w-full max-w-4xl p-3 gap-4 md:gap-6 relative"
      ref={dropdownRef}
    >
      {/* Location Input */}
      <div className="relative w-full md:w-1/3">
        <div className="flex items-center border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-4 py-2">
          <FaMapMarkerAlt className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Enter location"
            onChange={handleLocationChange}
            value={locationValue || ""}
            onFocus={() => {
              setShowLocationDropdown(true);
              setShowDropdown(false);
            }}
            className="w-full bg-transparent focus:outline-none text-left"
          />
        </div>
        {showLocationDropdown && (
          <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 h-auto max-h-[200px] overflow-y-auto z-50 text-left">
            <li
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-100 text-gray-700 border-b border-gray-300"
              onClick={() => handleSelectLocation("current_location")}
            >
              <FaMapMarkerAlt className="text-gray-500 mr-2" /> Current Location
            </li>
            {filteredLocations.map((loc, idx) => (
              <li
                key={idx}
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-100 text-gray-700 border-b border-gray-300"
                onClick={() => handleSelectLocation(loc)}
              >
                <FaSearch className="text-gray-500 mr-2" /> {loc.city}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-2/3">
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search doctors, clinics, specialties..."
          onChange={handleSearchChange}
          onFocus={() => {
            setShowLocationDropdown(false);
            setShowDropdown(true);
          }}
          value={searchValue}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && (
          <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 h-auto max-h-[380px] overflow-y-auto z-50">
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
        )}
      </div>
    </div>
  );
}
