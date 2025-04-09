import {
  FiUser,
  FiSettings,
  FiCalendar,
  FiHome,
  FiUsers,
} from "react-icons/fi";

export const menuItem = [
  { name: "Home", route: "/" },
  { name: "Find Doctors", route: "/find-doctors" },
  { name: "Video Consult", route: "#" },
  { name: "Service", route: "/ourservices" },
  { name: "Blog", route: "/blogs" },
  { name: "Contact Us", route: "/contact" },
];

export const mobileMenuItem = [
  { name: "Home", route: "/", icon: <FiHome className="mr-3" /> },
  {
    name: "Find Doctors",
    route: "/find-doctors",
    icon: <FiUser className="mr-3" />,
  },

  { name: "Profile", route: "/profile", icon: <FiUser className="mr-3" /> },
  {
    name: "Appointments",
    route: "/profile/appointments",
    icon: <FiCalendar className="mr-3" />,
  },
  {
    name: "Members",
    route: "/profile/members",
    icon: <FiUsers className="mr-3" />,
  },
  // {
  //   name: "Reviews",
  //   route: "/profile/reviews",
  //   icon: <FiStar className="mr-3" />,
  // },
  {
    name: "Settings",
    route: "/settings",
    icon: <FiSettings className="mr-3" />,
  },
];

export const mobileMenuWithoutLogout = [
  { name: "Home", route: "/", icon: <FiHome className="mr-3" /> },
  {
    name: "Find Doctors",
    route: "/find-doctors",
    icon: <FiUser className="mr-3" />,
  },
];
