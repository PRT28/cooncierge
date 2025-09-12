"use client";
import { useState, useEffect } from "react";
import { FaUser, FaCog, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Header = ({ isOpen }) => {
  const [isDropDownOpen, setisDropDownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = () => {
    // Redirect the user to the SignIn page
    router.push("/login");
  };

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const pieceMap = {
    "other-services": "OS",
    limitless: "Limitless",
    sales: "Sales",
    tasks: "Tasks",
    leads: "Leads",
    dashboard: "Dashboard",
    operations: "Operations",
    bookings: "Bookings",
    finance: "Finance",
    directory: "Directory",
    customers: "Customers",
    team: "Team",
    vendors: "Vendors",
    settings: "Settings",
  };

  const headerMap = {
    "/sales/limitless": "Sales - Limitless",
    "/sales/other-services": "Sales - OS",
    "/bookings/limitless": "Bookings - Limitless",
    "/bookings/other-services": "Bookings - OS",
    "/operations/limitless": "Operations - Limitless",
    "/operations/other-services": "Operations - OS",
    "/finance/limitless": "My Bookings - Limitless",
    "/finance/other-services": "My Bookings - OS",
    "/leads": "Leads",
    "/tasks": "Tasks",
    "/directory/vendors": "Directory - Vendors",
    "/directory/customers": "Directory - Customers",
    "/directory/team": "Directory - Team",
    "/dashboard": "Dashboard",
    "/settings": "Settings",
  };

  const generateBreadCrumb = () => {
    const urlPieces = pathname.split("/").slice(1);
    return urlPieces.map((piece, index) => (
      <span key={index} className="flex items-center ">
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-[#114958] font-medium mr-2">
          {pieceMap[piece]}
        </span>
      </span>
    ));
  };

  const generateHeaderTitle = () => {
    return headerMap[pathname];
  };

  useEffect(() => {
    // This runs every time the pathname changes
    console.log("Path changed to:", pathname);

    // Perform any side effect or trigger internal state update
  }, [pathname]);

  return (
    <div
      style={{
        marginLeft: isOpen ? "216px" : "64px",
        transition: "margin-left 0.5s ease-in-out",
      }}
    >
      {/* Header Main Row */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-white">
        {/* Left: Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {generateHeaderTitle()}
          </h1>
        </div>

        {/* Right: Notification, Profile Avatar, Profile Settings */}
        <div className="flex items-center gap-3">
          {/* Notification Bell with red dot */}
          <div className="relative">
            <button className="text-gray-500 hover:text-[#114958]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          {/* Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#114958] flex items-center justify-center">
            <IoPersonOutline className="text-white w-4 h-4" />
          </div>
          {/* Profile Settings Text with dropdown */}
          <div className="flex items-center cursor-pointer relative">
            <button
              onClick={() => setisDropDownOpen(!isDropDownOpen)}
              className="flex items-center gap-2 text-gray-700 font-medium focus:outline-none"
            >
              <span>Profile Settings</span>
              <IoMdArrowDropdown className="text-gray-700" />
            </button>
            {/* Dropdown menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-48 bg-gray-100 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-700 ease-in-out scroll-smooth ${
                isDropDownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-gray-100 py-2">
                <button className="flex items-center w-full px-4 py-2 text-sm hover:text-blue-400">
                  <FaUser className="mr-2" /> Profile
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="flex items-center w-full px-4 py-2 text-sm hover:text-blue-400"
                >
                  <FaCog className="mr-2" /> Settings
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm hover:text-blue-400">
                  <FaChartBar className="mr-2" /> Reports
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm hover:text-blue-400"
                  onClick={handleLogOut}
                >
                  <FaSignOutAlt className="mr-2" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Row */}
      <div className="flex items-center px-8 py-3 bg-gray-100 border-b border-gray-200">
        <IoHomeOutline className="w-5 h-5 mr-2 text-[#114958]" />
        {generateBreadCrumb()}
      </div>
    </div>
  );
};

export default Header;
