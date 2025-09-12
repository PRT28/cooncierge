"use client";
import { CalendarProvider } from "../../context/CalendarContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <div>
      <Sidebar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} />
      <Header isOpen={isSideBarOpen} />
      <CalendarProvider>
        <main className="flex-1">{children}</main>
      </CalendarProvider>
    </div>
  );
}
