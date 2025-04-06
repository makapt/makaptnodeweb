"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";

const settingsOptions = [
  { label: "Change Password", href: "/settings/change-password" },
  { label: "Delete Account", href: "/settings/delete-account" },
];

const SettingsLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="pt-24 pb-6 container mx-auto md:px-20 lg:px-32 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="block md:hidden bg-white shadow-sm border-b border-gray-200">
          {settingsOptions.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="flex justify-between items-center px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              <span>{item.label}</span>
              <FiChevronRight className="text-gray-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
