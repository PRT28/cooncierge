"use client";

import Image from "next/image";

export default function SidebarSkeleton() {
  return (
    <aside
      className="fixed top-0 left-0 h-screen w-16 border-r border-gray-700 px-2 py-4 z-50"
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(175.12deg, #0D4B37 27.08%, #63BB9E 153.71%)",
      }}
    >
      <div className="flex flex-col items-center h-full gap-6">
        <div className="pt-1">
          <Image
            src="/logo/cooncierge-logo-icon.svg"
            alt="Cooncierge logo"
            width={35}
            height={35}
            className="h-[35px] w-[35px]"
            priority
          />
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-8 rounded-full bg-white/40 animate-pulse"
            />
          ))}
        </div>
        <div className="h-6 w-6 rounded bg-white/30 animate-pulse" />
      </div>
    </aside>
  );
}
