"use client";
import BookingFormModal from "../../../components/BookingFormModal";
import Filter from "../../../components/Filter";
import SummaryCards from "../../../components/SummaryCards";
import Table from "../../../components/Table";
import { useState, useMemo } from "react";
import BookingFormSidesheet from "./../../../components/BookingFormSidesheet";

const OSBookingsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setIsSideSheetOpen(true);
  };

  const columns = [
    "#ID",
    "Lead Pax",
    "Travel Date",
    "Service",
    "Booking Status",
    "Amount",
    "Voucher",
    "Tasks",
  ];

  // Memoized table data with proper typing
  const tableData = useMemo(
    () => [
      {
        id: "#001",
        leadPax: "Anand Mishra",
        travelDate: "12-09-2025",
        service: "✈️ Flight",
        bookingStatus: "Successful",
        amount: "₹ 24,580",
        voucher: "📄",
        tasks: 3,
      },
      {
        id: "#002",
        leadPax: "Priya Sharma",
        travelDate: "15-09-2025",
        service: "🏨 Hotel",
        bookingStatus: "Pending",
        amount: "₹ 18,200",
        voucher: "📄",
        tasks: 2,
      },
      {
        id: "#003",
        leadPax: "Rajesh Kumar",
        travelDate: "20-09-2025",
        service: "🚗 Car Rental",
        bookingStatus: "Successful",
        amount: "₹ 12,500",
        voucher: "📄",
        tasks: 1,
      },
      {
        id: "#004",
        leadPax: "Sneha Patel",
        travelDate: "25-09-2025",
        service: "🎫 Package",
        bookingStatus: "Failed",
        amount: "₹ 45,000",
        voucher: "📄",
        tasks: 5,
      },
      {
        id: "#005",
        leadPax: "Vikram Singh",
        travelDate: "30-09-2025",
        service: "✈️ Flight",
        bookingStatus: "Successful",
        amount: "₹ 32,100",
        voucher: "📄",
        tasks: 2,
      },
    ],
    []
  );

  // Filter options for the Filter component
  const filterOptions = useMemo(
    () => ({
      serviceTypes: [
        { value: "flight", label: "✈️ Flight" },
        { value: "hotel", label: "🏨 Hotel" },
        { value: "car", label: "🚗 Car Rental" },
        { value: "package", label: "🎫 Package" },
      ],
      statuses: [
        { value: "successful", label: "Successful" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
      ],
      owners: [
        { value: "anand", label: "Anand Mishra" },
        { value: "priya", label: "Priya Sharma" },
        { value: "rajesh", label: "Rajesh Kumar" },
      ],
    }),
    []
  );

  const handleFilterChange = (filters) => {
    console.log("Filters changed:", filters);
    // Implement filter logic here
  };

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Successful":
        return "px-2 py-1 text-xs rounded-full bg-green-100 text-green-700";
      case "Pending":
        return "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700";
      case "Failed":
        return "px-2 py-1 text-xs rounded-full bg-red-100 text-red-700";
      default:
        return "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700";
    }
  };

  // Memoized formatted data for the table component
  const formattedData = useMemo(
    () =>
      tableData.map((row, index) => [
        <td key={`id-${index}`} className="px-4 py-3">
          {row.id}
        </td>,
        <td key={`lead-${index}`} className="px-4 py-3">
          {row.leadPax}
        </td>,
        <td key={`date-${index}`} className="px-4 py-3">
          {row.travelDate}
        </td>,
        <td key={`service-${index}`} className="px-4 py-3">
          {row.service}
        </td>,
        <td key={`status-${index}`} className="px-4 py-3">
          <span className={getStatusBadgeClass(row.bookingStatus)}>
            {row.bookingStatus}
          </span>
        </td>,
        <td key={`amount-${index}`} className="px-4 py-3">
          {row.amount}
        </td>,
        <td key={`voucher-${index}`} className="px-4 py-3">
          <button
            className="hover:scale-110 transition-transform"
            aria-label="View voucher"
          >
            {row.voucher}
          </button>
        </td>,
        <td key={`tasks-${index}`} className="px-4 py-3">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
            {row.tasks}
          </span>
        </td>,
      ]),
    [tableData]
  );

  return (
    <>
      <div className="flex justify-end gap-4 p-6 w-full mx-[10px] mt-[-12px]">
        <button className="bg-white text-[#114958] px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition">
          View Draft
        </button>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#114958] text-white px-6 py-2 rounded-lg shadow hover:bg-[#14505e] transition"
        >
          Create +
        </button>
      </div>
      <div className=" min-h-screen ml-20 mt-2 ">
        <Filter
          onFilterChange={handleFilterChange}
          serviceTypes={filterOptions.serviceTypes}
          statuses={filterOptions.statuses}
          owners={filterOptions.owners}
        />
        <SummaryCards />
        <Table data={formattedData} columns={columns} />
      </div>
      <BookingFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSelectedService={handleServiceSelect}
      />

      <BookingFormSidesheet
        isOpen={isSideSheetOpen}
        onClose={() => setIsSideSheetOpen(false)}
        selectedService={selectedService}
      />
    </>
  );
};

export default OSBookingsPage;
