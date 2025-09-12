"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";

export default function LimitlessLayout({ children }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <div>
      <Sidebar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} />
      <Header isOpen={isSideBarOpen} />

      <main className="flex-1">{children}</main>
    </div>
  );
}
