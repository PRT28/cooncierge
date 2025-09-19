"use client"

import type { JSX } from "react";
import dynamic from "next/dynamic";
import FilterSkeleton from "@/components/skeletons/FilterSkeleton";
import SummaryCardsSkeleton from "@/components/skeletons/SummaryCardsSkeleton";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

const Filter = dynamic(() => import("@/components/Filter"), {
  loading: () => <FilterSkeleton />,
  ssr: false,
});

const SummaryCards = dynamic(() => import("@/components/SummaryCards"), {
  loading: () => <SummaryCardsSkeleton />,
  ssr: false,
});

const Table = dynamic(() => import("@/components/Table"), {
  loading: () => <TableSkeleton />,
  ssr: false,
});

const columns: string[] = [
  "#ID",
  "Lead Pax",
  "Travel Date",
  "Service",
  "Booking Status",
  "Amount",
  "Voucher",
  "Tasks",
];

const data: JSX.Element[][] = [
  [
    <td key="id-001" className="px-4 py-3">
      #001
    </td>,
    <td key="lead-001" className="px-4 py-3">
      Anand Mishra
    </td>,
    <td key="date-001" className="px-4 py-3">
      12-09-2025
    </td>,
    <td key="service-001" className="px-4 py-3">
      ✈️ Flight
    </td>,
    <td key="status-001" className="px-4 py-3">
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
        Successful
      </span>
    </td>,
    <td key="amount-001" className="px-4 py-3">
      ₹ 24,580
    </td>,
    <td key="voucher-001" className="px-4 py-3">
      📄
    </td>,
    <td key="tasks-001" className="px-4 py-3">
      3
    </td>,
  ],
  [
    <td key="id-002" className="px-4 py-3">
      #002
    </td>,
    <td key="lead-002" className="px-4 py-3">
      Sumit Jha
    </td>,
    <td key="date-002" className="px-4 py-3">
      15-09-2025
    </td>,
    <td key="service-002" className="px-4 py-3">
      🏨 Accommodation
    </td>,
    <td key="status-002" className="px-4 py-3">
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
        In Progress
      </span>
    </td>,
    <td key="amount-002" className="px-4 py-3">
      ₹ 24,580
    </td>,
    <td key="voucher-002" className="px-4 py-3">
      📄
    </td>,
    <td key="tasks-002" className="px-4 py-3">
      3
    </td>,
  ],
  [
    <td key="id-003" className="px-4 py-3">
      #003
    </td>,
    <td key="lead-003" className="px-4 py-3">
      Deepanshu
    </td>,
    <td key="date-003" className="px-4 py-3">
      18-09-2025
    </td>,
    <td key="service-003" className="px-4 py-3">
      🚢 Transportation (Maritime)
    </td>,
    <td key="status-003" className="px-4 py-3">
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
        Failed
      </span>
    </td>,
    <td key="amount-003" className="px-4 py-3">
      ₹ 24,580
    </td>,
    <td key="voucher-003" className="px-4 py-3">
      📄
    </td>,
    <td key="tasks-003" className="px-4 py-3">
      3
    </td>,
  ],
  [
    <td key="id-004" className="px-4 py-3">
      #004
    </td>,
    <td key="lead-004" className="px-4 py-3">
      Zaheer
    </td>,
    <td key="date-004" className="px-4 py-3">
      20-09-2025
    </td>,
    <td key="service-004" className="px-4 py-3">
      🚌 Transportation (Land)
    </td>,
    <td key="status-004" className="px-4 py-3">
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
        Successful
      </span>
    </td>,
    <td key="amount-004" className="px-4 py-3">
      ₹ 24,580
    </td>,
    <td key="voucher-004" className="px-4 py-3">
      📄
    </td>,
    <td key="tasks-004" className="px-4 py-3">
      1
    </td>,
  ],
  [
    <td key="id-005" className="px-4 py-3">
      #005
    </td>,
    <td key="lead-005" className="px-4 py-3">
      Gaurav Kapoor
    </td>,
    <td key="date-005" className="px-4 py-3">
      22-09-2025
    </td>,
    <td key="service-005" className="px-4 py-3">
      ✈️ Flight
    </td>,
    <td key="status-005" className="px-4 py-3">
      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
        On Hold
      </span>
    </td>,
    <td key="amount-005" className="px-4 py-3">
      ₹ 24,580
    </td>,
    <td key="voucher-005" className="px-4 py-3">
      📄
    </td>,
    <td key="tasks-005" className="px-4 py-3">
      3
    </td>,
  ],
];

const LimitlessBookingsPage = () => {
  return (
    <>
      <div className="flex justify-end gap-4 p-6 w-full mx-[10px] mt-[-15px]">
        <button className="bg-white text-[#114958] px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition">
          View Draft
        </button>
        <button className="bg-[#114958] text-white px-6 py-2 rounded-lg shadow hover:bg-[#14505e] transition">
          Create +
        </button>
      </div>
      <div className="min-h-screen mt-2">
        <Filter />
        <SummaryCards />
        <Table data={data} columns={columns} />
      </div>
    </>
  );
};

export default LimitlessBookingsPage;
