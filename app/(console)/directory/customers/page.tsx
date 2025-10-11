"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import ActionMenu from "@/components/ActionMenu";
import type { JSX } from "react";

const Table = dynamic(() => import("@/components/Table"), {
  loading: () => <TableSkeleton />,
  ssr: false,
});

type CustomerRow = {
  customerID: string;
  name: string;
  rating: string;
  owner: string;
  dateCreated: string;
  actions: React.ComponentType<any> | string;
};

const columns: string[] = [
  "Customer ID",
  "Name",
  "Owner",
  "Date Created",
  "Rating",
  "Actions",
];

const customerTableSeed: CustomerRow[] = [
  {
    customerID: "#C001",
    name: "Amit Verma",
    owner: "Riya Kapoor",
    rating: "⭐️⭐️⭐️⭐️",
    dateCreated: "05-09-2025",
    actions: "⋮",
  },
  {
    customerID: "#C002",
    name: "Neha Gupta",
    owner: "Arjun Mehta",
    rating: "⭐️⭐️⭐️⭐️⭐️",
    dateCreated: "10-09-2025",
    actions: "⋮",
  },
  {
    customerID: "#C003",
    name: "Suresh Raina",
    owner: "Priya Nair",
    rating: "⭐️⭐️⭐️",
    dateCreated: "15-09-2025",
    actions: "⋮",
  },
  {
    customerID: "#C004",
    name: "Anjali Sharma",
    owner: "Karan Malhotra",
    rating: "⭐️⭐️⭐️⭐️",
    dateCreated: "20-09-2025",
    actions: "⋮",
  },
  {
    customerID: "#C005",
    name: "Rohit Yadav",
    owner: "Sneha Joshi",
    rating: "⭐️⭐️⭐️⭐️⭐️",
    dateCreated: "25-09-2025",
    actions: "⋮",
  },
];

const CustomerDirectory = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const tableData = useMemo<JSX.Element[][]>(
    () =>
      customerTableSeed.map((row, index) => [
        <td key={`customerID-${index}`} className="px-4 py-3">
          {row.customerID}
        </td>,
        <td key={`name-${index}`} className="px-4 py-3">
          {row.name}
        </td>,
        <td key={`owner-${index}`} className="px-4 py-3">
          {row.owner}
        </td>,
        <td key={`dateCreated-${index}`} className="px-4 py-3">
          {row.dateCreated}
        </td>,
        <td key={`rating-${index}`} className="px-4 py-3">
          {row.rating}
        </td>,
        <td key={`actions-${index}`} className="px-4 py-3">
          <ActionMenu />
        </td>,
      ]),
    []
  );
  return (
    <>
      <div className="flex justify-end gap-4 p-6 w-full mx-[10px] mt-[-20px]">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#0D4B37] text-white px-6 py-2 rounded-lg shadow hover:bg-[#14505e] transition"
          type="button"
        >
          + Add Customer
        </button>
      </div>
      <div className="min-h-screen mt-2">
        <Table data={tableData} columns={columns} />
      </div>
    </>
  );
};

export default CustomerDirectory;
