"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa"; // Import icons
import { useRouter } from "next/navigation"; // Import useRouter
import homeFactory from "@/actions/homeAction";
import useDebouncedCallback from "@/hooks/useDebouncedCallback";
import SearchList from "./SearchList";
import { useSearchParams } from "next/navigation";

export default function HomeSearchBox({
  selectedLocation,
  setSelectedLocation,
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [speData, setSpeData] = useState({ data: [] });
  const search = searchParams.get("search");

  const fetchData = async () => {
    const result = await homeFactory.getDefaultSpecialization();
    setSpeData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [filteredOptions, setFilteredOptions] = useState({
    spe_list: [],
    doc_list: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const getCurrentLatLong = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Fetch Address
            const fetchedAddress = await getAddressFromCoordinates(
              latitude,
              longitude
            );
            setLocationValue(fetchedAddress);
            setFilteredLocations([]);
            setSelectedLocation({
              address_line1: fetchedAddress,
              lat: latitude,
              lon: longitude,
            });
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
          if (error.code === error.PERMISSION_DENIED) {
            alert("Location permission denied. Please enable it in settings.");
          }
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  }, [setLocationValue, setFilteredLocations, setSelectedLocation]);

  useEffect(() => {
    getCurrentLatLong();
    setSearchValue(search);
  }, [getCurrentLatLong, search]);

  const getAddressFromCoordinates = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.address.city;
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleLocationChange = (e) => {
    const text = e.target.value.trim();
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
      address_line1: selectedLocation.address_line1 || "",
      lat: selectedLocation.lat || "",
      lng: selectedLocation.lon || "",
      id: item._id,
    });

    if (item.name) {
      queryParams.append("search", item.name);
      queryParams.append("slug", item.slugName);
      router.push(`/doctors?${queryParams.toString()}`);
    } else {
      router.push(`/doctors/${item.fullName}?${queryParams.toString()}`);
    }
    setShowDropdown(false);
  };

  const handleSelectLocation = (item) => {
    if (item === "current_location") {
      getCurrentLatLong();
    } else {
      setLocationValue(item.address_line1);
      setSelectedLocation(item);
    }
    setShowLocationDropdown(false);
    setShowDropdown(true);
  };

  return (
    <div
      className="bg-white rounded-lg flex flex-col md:flex-row w-full max-w-4xl p-4 gap-4 md:gap-6 relative"
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
                <FaSearch className="text-gray-500 mr-2" /> {loc.address_line1}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Input with Icon */}
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

        {/* <li className="px-4 py-2 flex items-center text-gray-500 border-b border-gray-300">
          <FaSearch className="mr-2" /> No results found
        </li> */}
      </div>
    </div>
  );
}
