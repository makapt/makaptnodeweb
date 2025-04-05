"use client"; // Needed for Next.js 13+ if using app router

import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // Import search icon
import Services from "@/components/home/Services";
import BrowseSpecialties from "@/components/home/BrowseSpecialties";
import DownloadApp from "@/components/home/DownloadApp";

const searchOptions = [
  "General Physician",
  "Dermatologist",
  "Pediatrician",
  "Dentist",
  "Cardiologist",
  "Neurologist",
  "Orthopedic",
  "ENT Specialist",
  "Gynecologist",
  "General Physician",
  "Dermatologist",
  "Pediatrician",
  "Dentist",
  "Cardiologist",
  "Neurologist",
  "Orthopedic",
  "ENT Specialist",
  "Gynecologist",
  "General Physician",
  "Dermatologist",
  "Pediatrician",
  "Dentist",
  "Cardiologist",
  "Neurologist",
  "Orthopedic",
  "ENT Specialist",
  "Gynecologist",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null); // Ref for dropdown container

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      const filtered = searchOptions.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectOption = (option) => {
    setSearchQuery(option);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* 🔹 Banner Section */}
      <div
        className="relative bg-cover bg-center text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #005cbf 0%, #396cf000 100%), url('/2.png')",
          height: "380px",
        }}
      >
        <div className="absolute inset-0 bg-opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center h-full">
          <h2 className="text-3xl sm:text-3xl md:text-5xl font-semibold max-w-3xl mt-10">
            Make Your Appointment Easier
          </h2>

          {/* 🔹 Search Box */}
          <div className="absolute bottom-[55px] md:bottom-[80px] w-full flex justify-center px-4">
            <div
              className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-4xl p-4 gap-4 md:gap-6 relative"
              ref={dropdownRef} // Attach ref to container
            >
              {/* Location Dropdown */}
              <select
                onFocus={() => setShowDropdown(false)}
                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-1/3"
              >
                <option value="">Select Location</option>
                <option value="newyork">New York</option>
                <option value="losangeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
                <option value="houston">Houston</option>
              </select>

              {/* Search Input with Icon */}
              <div className="relative w-full md:w-2/3">
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search doctors, clinics, specialties..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* 🔹 Dropdown Suggestions */}
                {showDropdown && (
                  <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 h-auto max-h-[380px] overflow-y-auto z-50">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, index) => (
                        <li
                          key={index}
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-100 text-gray-700"
                          onClick={() => handleSelectOption(option)}
                        >
                          <FaSearch className="mr-2 text-gray-500" />
                          <span className="ml-2 text-gray-800">{option}</span>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 flex items-center text-gray-500">
                        <FaSearch className="mr-2" /> No results found
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Search Button */}
              <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <DownloadApp />
    </div>
  );
}
