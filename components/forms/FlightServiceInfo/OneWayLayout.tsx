"use client";

import React, { useState } from "react";

import { CiCirclePlus } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdAirplanemodeActive } from "react-icons/md";
import { FiMinusCircle } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";

interface FlightInfoFormData {
  bookingdate: string;
  traveldate: string;
  bookingstatus: "Confirmed" | "Canceled" | "In Progress" | string;
  costprice: number | string;
  sellingprice: number | string;
  PNR: number | string;
  pnrEnabled: boolean;
  segments: FlightSegment[]; // Array of flight segments
  returnSegments: ReturnFlightSegment[];
  samePNRForAllSegments: boolean;
  flightType: "One Way" | "Round Trip" | "Multi-City";
  voucher: File | null;
  taxinvoice: File | null;
  remarks: string;
}

interface FlightSegment {
  id?: string | null;
  flightnumber: number | string;
  traveldate: string;
  cabinclass:
    | "Economy"
    | "Premium Economy"
    | "Business"
    | "First Class"
    | string;
}

interface ReturnFlightSegment {
  id?: string | null;
  flightnumber: number | string;
  traveldate: string;
  cabinclass:
    | "Economy"
    | "Premium Economy"
    | "Business"
    | "First Class"
    | string;
}

interface PreviewData {
  airline?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  flightNumber?: string;
  duration?: string;
}

export default function OneWayLayout({
  formData,
  setFormData,
}: {
  formData: FlightInfoFormData;
  setFormData: React.Dispatch<React.SetStateAction<FlightInfoFormData>>;
}) {
  const previewData: PreviewData = {
    airline: "IndiGo Airlines",
    origin: "Delhi (DEL)",
    destination: "Mumbai (BOM)",
    departureTime: "08:10 AM",
    arrivalTime: "10:05 AM",
    flightNumber: "A320",
    duration: "1h 55m",
  };

  const addSegment = () => {
    const newSegment: FlightSegment = {
      id: Date.now().toString(),
      flightnumber: "",
      traveldate: "",
      cabinclass: "",
    };
    setFormData({
      ...formData,
      segments: [...formData.segments, newSegment],
    });
  };

  const removeSegment = (id: string) => {
    if (formData.segments.length > 1) {
      setFormData({
        ...formData,
        segments: formData.segments.filter((segment) => segment.id !== id),
      });
    }
  };
  return (
    <div>
      {/* Onwards label */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Onwards (3h 40m)</span>
      </div>

      {/* Flight Segments and Preview Section */}
      <div className="space-y-6 border border-gray-200 rounded-lg p-4">
        {formData.segments.map((segment, index) => (
          <div
            key={segment.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* Flight Segment */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Flight Segment {index + 1}
                </h4>
                {formData.segments.length > 1 && (
                  <button
                    onClick={() => removeSegment(segment.id!)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiMinusCircle size={22} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Flight Number"
                    value={segment.flightnumber}
                    onChange={(e) => {
                      const updatedSegments = formData.segments.map((s) =>
                        s.id === segment.id
                          ? { ...s, flightnumber: e.target.value }
                          : s
                      );
                      setFormData({
                        ...formData,
                        segments: updatedSegments,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    placeholder="DD-MM-YYYY"
                    value={segment.traveldate}
                    onChange={(e) => {
                      const updatedSegments = formData.segments.map((s) =>
                        s.id === segment.id
                          ? { ...s, traveldate: e.target.value }
                          : s
                      );
                      setFormData({
                        ...formData,
                        segments: updatedSegments,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cabin Class
                  </label>
                  <div className="relative">
                    <select
                      value={segment.cabinclass}
                      onChange={(e) => {
                        const updatedSegments = formData.segments.map((s) =>
                          s.id === segment.id
                            ? { ...s, cabinclass: e.target.value }
                            : s
                        );
                        setFormData({
                          ...formData,
                          segments: updatedSegments,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Choose Cabin Class</option>
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                    <MdKeyboardArrowDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border-3 border-dotted border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">Preview</h4>
                <button className="text-blue-600 hover:text-blue-700">
                  <MdOutlineEdit size={20} />
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-4 min-h-[200px]">
                {index === 0 ? (
                  <>
                    {/* Airline Header */}
                    <div className="bg-blue-100 border border-blue-200 rounded-md p-3 mb-4 flex items-center gap-3">
                      {/* airline icon */}
                      <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                        {/* Airline Name */}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {previewData.airline}
                      </span>
                    </div>

                    {/* Flight Route Layout */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Origin
                          </div>
                          <div className="font-semibold text-gray-900">
                            {previewData.origin}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">STD</div>
                          <div className="font-semibold text-gray-900">
                            {previewData.departureTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Flight Number
                          </div>
                          <div className="font-semibold text-gray-900">
                            {previewData.flightNumber}
                          </div>
                        </div>

                        {/* flight path visual */}
                        <div className="flex-1 mx-4 flex items-center justify-center">
                          {/* Vertical dotted line and plane icon will go here */}
                          <div className="text-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mb-2"></div>
                            <div className="h-8 border-l-2 border-dotted border-gray-300 mx-auto"></div>
                            {/* Plane icon  */}
                            <div className="my-2">{/* Plane icon */}</div>
                            <div className="h-8 border-l-2 border-dotted border-gray-300 mx-auto"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            Duration
                          </div>
                          <div className="font-semibold text-gray-900">
                            {previewData.duration}
                          </div>
                        </div>
                      </div>

                      {/* Destination Section */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Destination
                          </div>
                          <div className="font-semibold text-gray-900">
                            {previewData.destination}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">STA</div>
                          <div className="font-semibold text-gray-900">
                            {previewData.arrivalTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-sm">Preview data will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSegment}
        className="flex items-center gap-2 px-4 py-2 mt-4 bg-[#126ACB] text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        <CiCirclePlus size={20} />
        Add Segment
      </button>
    </div>
  );
}
