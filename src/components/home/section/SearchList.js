import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa"; // Import icons

export default function SearchList({ path, option, handleSelectFilter }) {
  return (
    <li
      className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-100 text-gray-700 border-b border-gray-300"
      onClick={() => handleSelectFilter(option)}
    >
      {option.name ? (
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
            background: "#f0f0f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaSearch className="text-gray-500" />
        </div>
      ) : (
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
          }}
          width="100"
          height="100"
          src={path + option.image}
          alt={"Search result image"} // Provide a meaningful alt text
        />
      )}
      <span className="ml-2 text-gray-800">
        {option.name || option.fullName}
      </span>
    </li>
  );
}
