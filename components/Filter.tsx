"use client";

import React, { useState, useCallback, useMemo } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiRefreshLine } from "react-icons/ri";

// Type definitions
interface FilterOption {
  id?: string;
  _id?: string;
  value?: string;
  name?: string;
  label?: string;
}

interface FilterState {
  serviceType: string;
  status: string;
  owner: string;
  search: string;
  bookingStartDate: string;
  bookingEndDate: string;
  tripStartDate: string;
  tripEndDate: string;
}

interface FilterProps {
  onFilterChange?: (filters: FilterState) => void;
  serviceTypes?: FilterOption[];
  statuses?: FilterOption[];
  owners?: FilterOption[];
  initialFilters?: Partial<FilterState>;
  createOpen?: boolean;
  setCreateOpen?: (open: boolean) => void;
}

const Filter: React.FC<FilterProps> = ({
  onFilterChange,
  serviceTypes = [],
  statuses = [],
  owners = [],
  initialFilters = {},
  createOpen = false,
  setCreateOpen,
}) => {
  // Consolidated filter state
  const [filters, setFilters] = useState<FilterState>({
    serviceType: initialFilters.serviceType || "",
    status: initialFilters.status || "",
    owner: initialFilters.owner || "",
    search: initialFilters.search || "",
    bookingStartDate: initialFilters.bookingStartDate || "",
    bookingEndDate: initialFilters.bookingEndDate || "",
    tripStartDate: initialFilters.tripStartDate || "",
    tripEndDate: initialFilters.tripEndDate || "",
  });

  // Memoized filter update handler
  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        onFilterChange?.(newFilters);
        return newFilters;
      });
    },
    [onFilterChange]
  );

  // Memoized reset handler
  const handleReset = useCallback(() => {
    const resetFilters: FilterState = {
      serviceType: "",
      status: "",
      owner: "",
      search: "",
      bookingStartDate: "",
      bookingEndDate: "",
      tripStartDate: "",
      tripEndDate: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  }, [onFilterChange]);

  // Memoized apply handler
  const handleApply = useCallback(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  // Memoized option renderer
  const renderOptions = useCallback(
    (options: FilterOption[]) =>
      options.map((option) => (
        <option
          key={option.id || option._id || option.value || option.name}
          value={option.value || option.name || String(option)}
        >
          {option.label || option.name || String(option)}
        </option>
      )),
    []
  );

  // Memoized service type options
  const serviceTypeOptions = useMemo(
    () => renderOptions(serviceTypes),
    [serviceTypes, renderOptions]
  );

  // Memoized status options
  const statusOptions = useMemo(
    () => renderOptions(statuses),
    [statuses, renderOptions]
  );

  // Memoized owner options
  const ownerOptions = useMemo(
    () => renderOptions(owners),
    [owners, renderOptions]
  );

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-5 -mt-4 w-full relative">
      <h2 className="text-lg font-bold mb-4 text-left">Filters</h2>
      <button
        onClick={() => setCreateOpen?.(true)}
        className="absolute top-5 right-5 border border-[#0D4B37] bg-white text-[#0D4B37] px-6 py-2 -mt-2 rounded-lg shadow hover:bg-gray-200 transition"
        type="button"
      >
        Create +
      </button>
      <hr className="mb-3 border-t-2 border-[#e4dfdb]" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Service Type Filter */}
        <div className="text-left">
          <label className="block text-gray-700 mb-2" htmlFor="service-type">
            Service Type
          </label>
          <div className="relative">
            <select
              id="service-type"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent pr-8 appearance-none transition-colors"
              value={filters.serviceType}
              onChange={(e) => updateFilter("serviceType", e.target.value)}
            >
              <option value="">Service Type</option>
              {serviceTypeOptions}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdOutlineKeyboardArrowDown size={22} />
            </span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="text-left">
          <label className="block text-gray-700 mb-2" htmlFor="status">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent pr-8 appearance-none transition-colors"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">Status</option>
              {statusOptions}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdOutlineKeyboardArrowDown size={22} />
            </span>
          </div>
        </div>

        {/* Owner Filter */}
        {/* <div className="text-left">
          <label className="block text-gray-700 mb-2" htmlFor="owner">
            Owner (Primary)
          </label>
          <div className="relative">
            <select
              id="owner"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent pr-8 appearance-none transition-colors"
              value={filters.owner}
              onChange={(e) => updateFilter('owner', e.target.value)}
            >
              <option value="">Select Owner</option>
              {ownerOptions}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MdOutlineKeyboardArrowDown size={22} />
            </span>
          </div>
        </div> */}

        {/* Search */}
        <div className="text-left col-span-2">
          <label className="block text-gray-700 mb-2" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by Booking ID / Lead Pax"
            className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent transition-colors"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Booking Start Date */}
        <div className="text-left">
          <label
            className="block text-gray-700 mb-2"
            htmlFor="booking-start-date"
          >
            Booking Start Date
          </label>
          <input
            id="booking-start-date"
            type="date"
            className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent transition-colors"
            value={filters.bookingStartDate}
            onChange={(e) => updateFilter("bookingStartDate", e.target.value)}
          />
        </div>

        {/* Booking End Date */}
        <div className="text-left">
          <label
            className="block text-gray-700 mb-2"
            htmlFor="booking-end-date"
          >
            Booking End Date
          </label>
          <input
            id="booking-end-date"
            type="date"
            className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent transition-colors"
            value={filters.bookingEndDate}
            onChange={(e) => updateFilter("bookingEndDate", e.target.value)}
          />
        </div>

        {/* Trip Start Date */}
        <div className="text-left">
          <label className="block text-gray-700 mb-2" htmlFor="trip-start-date">
            Trip Start Date
          </label>
          <input
            id="trip-start-date"
            type="date"
            className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent transition-colors"
            value={filters.tripStartDate}
            onChange={(e) => updateFilter("tripStartDate", e.target.value)}
          />
        </div>

        {/* Trip End Date */}
        <div className="text-left">
          <label className="block text-gray-700 mb-2" htmlFor="trip-end-date">
            Trip End Date
          </label>
          <input
            id="trip-end-date"
            type="date"
            className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#114958] focus:border-transparent transition-colors"
            value={filters.tripEndDate}
            onChange={(e) => updateFilter("tripEndDate", e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleReset}
          className="bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors flex items-center justify-center"
          aria-label="Reset filters"
        >
          <RiRefreshLine size={22} className="text-[#114958]" />
        </button>
        <button
          onClick={handleApply}
          className="bg-white text-[#0D4B37] px-8 py-2 rounded-lg shadow hover:bg-gray-200 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default React.memo(Filter);
