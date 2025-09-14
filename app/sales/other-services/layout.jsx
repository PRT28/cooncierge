"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState, useMemo } from "react";

export default function OSLayout({ children }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const mainStyle = useMemo(() => ({
      marginLeft: isSideBarOpen ? "216px" : "64px",
      transition: "margin-left 0.5s ease-in-out",
      overflowX: 'hidden'
    }), [isSideBarOpen]);


  return (
    <div>
      <Sidebar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} />
      <Header isOpen={isSideBarOpen} />

      <main style={mainStyle}>{children}</main>
    </div>
  );
}
