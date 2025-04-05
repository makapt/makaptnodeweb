import React from "react";

export default function Breadcrumb() {
  return (
    <nav className="text-sm text-gray-500 mb-2">
      <a href="#" className="hover:underline">
        Home
      </a>{" "}
      /
      <a href="#" className="hover:underline">
        Doctors
      </a>{" "}
      / General Physicians
    </nav>
  );
}
