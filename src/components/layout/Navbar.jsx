"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiX, FiLogOut } from "react-icons/fi";

import logo from "@/assets/logo/brandLogo.png";
import menu_icon from "@/assets/menu_icon.svg";
import { useRouter } from "next/navigation"; // Import useRouter
import userAvatar from "@/assets/img/blank-profile-picture.png";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  menuItem,
  mobileMenuItem,
  mobileMenuWithoutLogout,
} from "@/constants/menuItem";
import useDeviceType from "@/hooks/useDeviceType";

const Navbar = () => {
  const router = useRouter();
  const { isMobile } = useDeviceType();
  const { isLoggedInUser, accounts, handlerLogout } = useApplicationContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuitemmob = isLoggedInUser ? mobileMenuItem : mobileMenuWithoutLogout;

  const pathname = usePathname();

  // Inside Navbar component, add:
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  const profileIconClick = () => {
    if (isMobile) {
      router.push("/profile");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50 h-16 md:h-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-6 md:px-10 lg:px-20">
        <div className="flex items-center gap-8">
          <Image
            onClick={() => setShowMobileMenu(true)}
            src={menu_icon}
            className="md:hidden w-8 cursor-pointer"
            alt="Menu"
          />
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="block md:hidden"
            />
            <Image
              src={logo}
              alt="Logo"
              width={60}
              height={60}
              className="hidden md:block"
            />
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 lg:gap-8 text-gray-800 font-medium">
          {menuItem.map((item, i) => (
            <Link
              key={i}
              href={item.route}
              className={`hover:text-blue-600 transition duration-300 ${
                pathname === item.route ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="relative flex items-center gap-4">
          {isLoggedInUser ? (
            <div className="relative" ref={dropdownRef}>
              <div
                id="user-icon"
                onClick={profileIconClick}
                className="relative flex items-center gap-2 cursor-pointer"
              >
                <Image
                  src={userAvatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300"
                />
                <span className="hidden md:block text-gray-800 font-medium">
                  {accounts?.fullName}
                </span>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push("/settings/change-password");
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      handlerLogout();
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/getstarted"
              className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full transition hover:bg-blue-600 hover:text-white"
            >
              Signup / Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-opacity-50 z-40 transition-opacity ${
          showMobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setShowMobileMenu(false)}
      ></div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`p-4 fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setShowMobileMenu(false)}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <ul className="space-y-4">
          {menuitemmob.map((item, i) => (
            <li
              key={i}
              onClick={() => {
                router.push(item.route);
                setShowMobileMenu(false);
              }}
              className="flex items-center p-2 rounded-lg bg-gray-200 cursor-pointer"
            >
              {item.icon} {item.name}
            </li>
          ))}
          <li
            onClick={handlerLogout}
            className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            <FiLogOut className="mr-3" /> Logout
          </li>
        </ul>

        <div className="flex flex-col items-center gap-4 mt-6">
          {!isLoggedInUser && (
            <Link
              href="/getstarted"
              className="w-40 text-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full transition hover:bg-blue-600 hover:text-white"
            >
              Signup / Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
