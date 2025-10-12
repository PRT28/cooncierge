"use client";

import React, { useState, useEffect } from "react";
import SideSheet from "../SideSheet";
import { createCustomer } from "@/services/customerApi";

type CustomerData = {
  name?: string;
  email?: string;
  phone?: string;
  roleId?: { _id: string };
};

type AddCustomerSideSheetProps = {
  data?: CustomerData | null;
  onCancel: () => void;
  isOpen: boolean;
};

const AddCustomerSideSheet: React.FC<AddCustomerSideSheetProps> = ({
  data,
  onCancel,
  isOpen,
}) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("+91");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone?.slice(3) || "");
      setPhoneCode(data.phone?.slice(0, 3) || "+91");
    }

    return () => {
      setName("");
      setEmail("");
      setPhone("");
      setPhoneCode("+91");
    };
  }, [data]);

  const handleSubmit = async () => {
    try {
      const customerData = {
        name,
        email,
        phone: `${phoneCode}${phone}`,
      };

      const response = await createCustomer(customerData);
      console.log("Customer created successfully:", response);

      // close the sidesheet after success
      onCancel();

      // trigger refresh or toast notification
    } catch (error: any) {
      console.error("Error creating customer:", error.message || error);
    }
  };

  return (
    <>
      <SideSheet
        isOpen={isOpen}
        onClose={onCancel}
        title="Add Customer"
        width="lg"
        position="right"
      >
        <div className="p-6 w-[780px] space-y-4">
          <div className="text-left">
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="text-left">
            <label className="block mb-2 font-medium">Email ID</label>
            <input
              type="email"
              placeholder="Enter Email ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-left">
            <label className="block mb-2 font-medium">Contact Number</label>
            <div className="flex gap-2">
              <select
                className="border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-700"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                type="text"
                placeholder="Enter Contact Number"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-[#114958] text-white hover:bg-[#0f3d44]"
              onClick={handleSubmit}
            >
              Add New Customer
            </button>
          </div>
        </div>
      </SideSheet>
    </>
  );
};

export default AddCustomerSideSheet;
