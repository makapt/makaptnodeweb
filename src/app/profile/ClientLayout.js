"use client";

import { useState } from "react";
import { mobileMenuItem } from "@/constants/menuItem";
import Link from "next/link";
import { usePathname } from "next/navigation";

const excludedItems = ["Settings", "Home", "Find Doctors"];

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-200 text-gray-900 p-6 flex-col space-y-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold">Profile Menu</h2>
        <nav>
          <ul className="space-y-2">
            {mobileMenuItem
              .filter((item) => !excludedItems.includes(item.name))
              .map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.route}
                    className={`block p-2 rounded transition-all ${
                      activeItem === item.route
                        ? "bg-blue-500 text-white font-semibold"
                        : "hover:bg-gray-300"
                    }`}
                    onClick={() => setActiveItem(item.route)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:p-6 rounded-lg shadow-md">
        <div className="w-full md:w-4/5">{children}</div>
      </main>
    </div>
  );
}
