"use client";

import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiRefreshLine } from "react-icons/ri";

const Filter = () => {
  // Filter dropdown state
  const [serviceTypes, setServiceTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  return (
    <>
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow p-5 mb-5 w-full">
        <h2 className="text-xl font-bold mb-4 text-left">Filters</h2>
        <hr className="mb-3 border-t-2 border-[#e4dfdb] " />
        {/* Service type Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl p-4 text-left">
            <label className="block text-gray-700 mb-2">Service Type</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none pr-8 appearance-none"
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
              >
                <option value="">Service Type</option>
                {serviceTypes.map((type) => (
                  <option
                    key={type.id || type._id || type}
                    value={type.value || type.name || type}
                  >
                    {type.label || type.name || type}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MdOutlineKeyboardArrowDown size={22} />
              </span>
            </div>
          </div>
          {/* Status Filter */}
          <div className="rounded-xl p-4 text-left">
            <label className="block text-gray-700 mb-2">Status</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none pr-8 appearance-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Status</option>
                {statuses.map((status) => (
                  <option
                    key={status.id || status._id || status}
                    value={status.value || status.name || status}
                  >
                    {status.label || status.name || status}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MdOutlineKeyboardArrowDown size={22} />
              </span>
            </div>
          </div>
          {/* Owner Filter */}
          <div className="rounded-xl p-4 text-left ">
            <label className="block text-gray-700 mb-2">Owner (Primary)</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none pr-8 appearance-none"
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
              >
                <option value="">Select Owner</option>
                {owners.map((owner) => (
                  <option
                    key={owner.id || owner._id || owner}
                    value={owner.value || owner.name || owner}
                  >
                    {owner.label || owner.name || owner}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MdOutlineKeyboardArrowDown size={22} />
              </span>
            </div>
          </div>
          <div className="rounded-xl p-4 text-left">
            <label className="block mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by Booking ID / Lead Pax"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none"
            />
          </div>
          <div className="rounded-xl p-4 text-left mr-[25px] mt-[-15px]">
            <label className="block text-gray-700 mb-2">
              Booking Start Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none"
            />
          </div>
          <div className="rounded-xl p-4 text-left mr-25 ml-[-35px] mt-[-15px]">
            <label className="block text-gray-700 mb-2">Booking End Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl p-4 text-left ml-25 mr-[-35px] mt-[-15px]">
            <label className="block text-gray-700 mb-2">Trip Start Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none"
            />
          </div>
          <div className="rounded-xl p-4 text-left ml-[25px] mt-[-15px]">
            <label className="block text-gray-700 mb-2">Trip End Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-2 py-3 text-gray-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-1 mr-4">
          <button className="bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition flex items-center justify-center">
            <RiRefreshLine size={22} className="text-[#114958]" />
          </button>
          <button className="bg-[#114958] text-white px-8 py-2 rounded-lg shadow hover:bg-[#14505e] transition">
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
