"use client";

export default function SidesheetSkeleton() {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-xl border-l border-gray-200 animate-pulse">
      <div className="h-14 border-b border-gray-200 bg-gray-100" />
      <div className="p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}
