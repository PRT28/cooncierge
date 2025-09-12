"use client";

import React, { useState } from "react";
import Sidesheet from "../components/SideSheet";
import GeneralInfoForm from "./forms/GeneralInfoForm";

const BookingFormSidesheet = ({ isOpen, onClose, selectedService }) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <>
      <Sidesheet isOpen={isOpen} onClose={onClose} title={`${selectedService}`}>
        {/* tabs go here */}
        <div className="border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab == "general"
                ? "border-green-500 text-green-600 "
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General Info
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab == "service"
                ? "border-green-500 text-green-600 "
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("service")}
          >
            Service Info
          </button>
        </div>
        <div>
          {activeTab == "general" && <GeneralInfoForm />}
          {activeTab == "service" && <GeneralInfoForm />}
        </div>
      </Sidesheet>
    </>
  );
};

export default BookingFormSidesheet;
