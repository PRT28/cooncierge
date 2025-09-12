import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { BsPlusSquareFill } from "react-icons/bs";

const GeneralInfoForm = () => {
  const [formData, setFormData] = useState({
    customer: "",
    vendor: "",
    adults: 2,
    children: 0,
    infants: 1,
    traveller1: "",
    traveller2: "",
    traveller3: "",
    bookingOwner: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <form className="space-y-6 p-6">
      {/* Billed To */}
      <div className="border border-gray-200 rounded-md p-4 ">
        <label className="block text-sm font-medium text-gray-700">
          Name / Customer ID <span className="text-red-500">*</span>
        </label>
        <hr className="mt-1 mb-2 border-t border-gray-200" />
        <div className="flex items-center gap-1 mt-3">
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Search by Customer Name/ID"
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          <div className="flex">
            <button type="button" className="p-2">
              <IoEye size={20} />
            </button>
            <button type="button" className="p-2 -ml-2">
              <BsPlusSquareFill size={20} />
            </button>
          </div>
        </div>
        <button type="button" className="mt-2 text-gray-500 text-sm">
          + Add New Customer
        </button>
      </div>

      {/* Vendor */}
      <div className="border border-gray-200 rounded-md p-4 ">
        <label className="block text-sm font-medium text-gray-700">
          Name / Vendor ID <span className="text-red-500">*</span>
        </label>
        <hr className="mt-1 mb-2 border-t border-gray-200" />
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            placeholder="Search by Customer Name/ID"
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          />
          <div className="flex">
            <button type="button" className="p-2">
              <IoEye size={20} />
            </button>
            <button type="button" className="p-2 -ml-2">
              <BsPlusSquareFill size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Travellers */}
      <div className="border border-gray-200 rounded-md p-4 ">
        <label className="block text-sm font-medium text-gray-700">
          Travellers
        </label>
        <hr className="mt-1 mb-2 border-t border-gray-200" />

        <div className="flex gap-6 mt-3">
          <div>
            <label className="block text-xs text-gray-500">Adults</label>
            <input
              type="number"
              min="0"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Children</label>
            <input
              type="number"
              min="0"
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Infants</label>
            <input
              type="number"
              min="0"
              name="infants"
              value={formData.infants}
              onChange={handleChange}
              className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Traveller Inputs */}
        <div className="mt-4 space-y-4 ">
          <div className="flex items-center gap-1 mt-1">
            <input
              type="text"
              placeholder="Adult 1 (Lead Pax)"
              name="traveller1"
              value={formData.traveller1 || ""}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />

            <button type="button" className="p-2">
              <IoEye size={20} />
            </button>
            <button type="button" className="p-2 -ml-2">
              <BsPlusSquareFill size={20} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Adult 2"
              name="traveller2"
              value={formData.traveller2}
              onChange={handleChange}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <button type="button" className="p-2">
              <IoEye size={20} />
            </button>
            <button type="button" className="p-2 -ml-2">
              <BsPlusSquareFill size={20} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Infant 1"
              name="traveller3"
              value={formData.traveller3}
              onChange={handleChange}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <button type="button" className="p-2">
              <IoEye size={20} />
            </button>
            <button type="button" className="p-2 -ml-2">
              <BsPlusSquareFill size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Owner */}
      <div className="border border-gray-200 rounded-md p-4 ">
        <label className="block text-sm font-medium text-gray-700">
          Booking Owner
        </label>
        <hr className="mt-1 mb-2 border-t border-gray-200" />
        <input
          type="text"
          placeholder="Owner Name"
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mt-2"
        />
      </div>

      {/* Remarks */}

      <div className="border border-gray-200 rounded-md p-4 ">
        <label className="block text-sm font-medium text-gray-700">
          Remarks
        </label>
        <hr className="mt-1 mb-2 border-t border-gray-200" />
        <textarea
          type="text"
          rows={5}
          placeholder="Enter Your Remarks Here"
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mt-2"
        />
      </div>
    </form>
  );
};

export default GeneralInfoForm;
