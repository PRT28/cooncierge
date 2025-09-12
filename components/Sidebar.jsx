"use client";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { FaChartLine, FaCheckDouble } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { TbLuggage } from "react-icons/tb";
import { LuClipboardList } from "react-icons/lu";
import { PiCurrencyCircleDollar } from "react-icons/pi";
import { TbBrandNetbeans } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { RiContactsBook3Line } from "react-icons/ri";

const menuItems = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Leads",
    icon: GoPeople,
    href: "/leads",
  },
  {
    label: "Sales",
    icon: FaChartLine,
    subMenu: [
      { label: "Limitless", href: "/sales/limitless" },
      { label: "Other Services", href: "/sales/other-services" },
    ],
  },
  {
    label: "Operations",
    icon: TbBrandNetbeans,
    subMenu: [
      { label: "Limitless", href: "/operations/limitless" },
      { label: "Other Services", href: "/operations/other-services" },
    ],
  },
  {
    label: "Bookings",
    icon: TbLuggage,
    subMenu: [
      { label: "Limitless", href: "/bookings/limitless" },
      { label: "Other Services", href: "/bookings/other-services" },
    ],
  },
  {
    label: "Content",
    icon: LuClipboardList,
  },
  {
    label: "Finance",
    icon: PiCurrencyCircleDollar,
    subMenu: [
      { label: "Limitless", href: "/finance/limitless" },
      { label: "Other Services", href: "/finance/other-services" },
    ],
  },
  {
    label: "Directory",
    icon: RiContactsBook3Line,
    subMenu: [
      { label: "Vendors", href: "/directory/vendors" },
      { label: "Customers", href: "/directory/customers" },
      { label: "Team", href: "/directory/team" },
    ],
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const router = useRouter();
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // close sidebar if click is outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen text-white border-r border-gray-700 transition-all transform duration-500 ease-in-out z-50 ${
          isOpen ? "w-54" : "w-16"
        }`}
        style={{
          background:
            "linear-gradient(175.12deg, #0D4B37 27.08%, #63BB9E 153.71%)",
        }}
      >
        {/* Toggle Button - icon only, inside sidebar, right aligned */}
        <div className="flex justify-end items-center w-full gap-3 pt-3">
          {isOpen && (
            <img
              src="/logo/cooncierge-wordmark.svg"
              alt="cooncierge"
              className="h-[30px]"
            />
          )}
          <img
            src="/logo/cooncierge-logo-icon.svg"
            alt="Logo"
            className="h-[35px] w-[35px] mr-5"
          />
        </div>

        {/* Menu Items */}
        <ul className="mt-12 space-y-1">
          {menuItems.map((item, index) => (
            <li
              key={item.label}
              className={`relative group cursor-pointer ${
                openSubMenuIndex === index ? "bg-[#387a64]" : ""
              }`}
              style={{
                background:
                  openSubMenuIndex === index || hoveredIndex === index
                    ? "#387a64"
                    : undefined,
                transition: "background 0.3s",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (item.subMenu) {
                  setOpenSubMenuIndex(
                    openSubMenuIndex === index ? null : index
                  );
                } else {
                  router.push(item.href);
                }
              }}
            >
              <div className="flex items-center gap-2 px-4 h-12">
                <item.icon className="w-6 h-6 text-white" />
                {isOpen && <span className="text-sm">{item.label}</span>}
                
                {isOpen &&
                  item.label !== "Tasks" &&
                  item.label !== "Content" &&
                  item.label !== "Leads" &&
                  item.label !== "Dashboard" && (
                    <MdKeyboardArrowUp
                      size={16}
                      className="transform transition-transform duration-300 group-hover:rotate-180 text-gray-400"
                    />
                  )}
              </div>
              {/* Submenu Dropdown - open only on click */}
              {item.subMenu && isOpen && (
                <ul
                  className={`pl-8 mt-2 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                    openSubMenuIndex === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  style={{
                    background:
                      openSubMenuIndex === index ? "#387a64" : undefined,
                    borderRadius: "0.5rem",
                    transition: "background 0.3s",
                  }}
                >
                  {item.subMenu.map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className="cursor-pointer text-left text-sm py-1 px-2 rounded text-white"
                      onClick={() => {
                        router.push(sub.href);
                      }}
                    >
                      {sub.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
