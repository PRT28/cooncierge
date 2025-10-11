"use client";

import React, { useState, useCallback, useMemo } from "react";
import { validateAccommodationInfoForm } from "@/services/bookingApi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import HotelLayout from "./HotelLayout";
import { useRef } from "react";
import VillaLayout from "./VillaLayout";
// Type definitions
interface AccommodationInfoFormData {
  bookingdate: string;
  traveldate: string; // This can be the main/first travel date
  bookingstatus: "Confirmed" | "Canceled" | "In Progress" | string;
  checkindate: string;
  checkintime: string;
  checkoutdate: string;
  checkouttime: string;
  checkOutPeriod: "AM" | "PM";
  pax: number | string;
  mealPlan: "EPAI" | "CPAI" | "MAPAI" | "APAI" | string;
  confirmationNumber: number | string;
  accommodationType:
    | "Hotel"
    | "Resort"
    | "Hostel"
    | "Villa"
    | "Apartment"
    | "Homestay"
    | "Experiental Stay"
    | string;
  propertyName: string;
  propertyAddress: string;
  googleMapsLink: string;
  segments: RoomSegment[];
  costprice: number | string;
  sellingprice: number | string;
  voucher: File | null;
  taxinvoice: File | null;
  remarks: string;
}

interface RoomSegment {
  id?: string | null;
  roomCategory: string;
  bedType: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface AccommodationInfoFormProps {
  onSubmit?: (data: AccommodationInfoFormData) => void;
  isSubmitting?: boolean;
  showValidation?: boolean;
}

const AccommodationServiceInfoForm: React.FC<AccommodationInfoFormProps> = ({
  onSubmit,
  isSubmitting = false,
  showValidation = true,
}) => {
  // Internal form state
  const [formData, setFormData] = useState<AccommodationInfoFormData>({
    bookingdate: "",
    traveldate: "",
    bookingstatus: "",
    costprice: "",
    sellingprice: "",
    confirmationNumber: "",
    checkindate: "",
    checkintime: "",
    checkoutdate: "",
    checkouttime: "",
    checkOutPeriod: "AM",
    pax: "",
    mealPlan: "",
    propertyName: "",
    propertyAddress: "",
    googleMapsLink: "",
    segments: [
      {
        id: "room-1",
        roomCategory: "",
        bedType: "",
      },
    ],
    accommodationType: "",
    voucher: null,
    taxinvoice: null,
    remarks: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const voucherRef = useRef<HTMLInputElement | null>(null);
  const taxinvoiceRef = useRef<HTMLInputElement | null>(null);
  const [costPriceCurrency, setCostPriceCurrency] = useState("INR");
  const [sellingPriceCurrency, setSellingPriceCurrency] = useState("INR");
  const [showCostDropdown, setShowCostDropdown] = useState(false);
  const [showSellingDropdown, setShowSellingDropdown] = useState(false);
  const [roeVisibleFor, setRoeVisibleFor] = useState<null | "cost" | "selling">(
    null
  );

  const handleSegmentsChange = (updatedSegments: RoomSegment[]) => {
    setFormData((prev) => ({
      ...prev,
      segments: updatedSegments,
    }));
  };

  const [filesAdded, setFilesAdded] = useState({
    voucher: false,
    taxinvoice: false,
  });

  // Hard-coded exchange rate for demonstration
  const exchangeRate = 88.05;

  const handleCurrencyChange = (
    type: "cost" | "selling",
    currency: "INR" | "USD"
  ) => {
    if (type === "cost") {
      setCostPriceCurrency(currency);
      setShowCostDropdown(false);
      setRoeVisibleFor(currency === "USD" ? "cost" : null);
    } else {
      setSellingPriceCurrency(currency);
      setShowSellingDropdown(false);
      setRoeVisibleFor(currency === "USD" ? "selling" : null);
    }
  };

  const handleFileChange = (field: "voucher" | "taxinvoice") => {
    let ref: React.RefObject<HTMLInputElement | null>;
    if (field === "voucher") ref = voucherRef;
    if (field === "taxinvoice") ref = taxinvoiceRef;
  };

  type FieldRule = {
    required: boolean;
    message: string;
    minLength?: number;
    pattern?: RegExp;
  };

  // Validation rules
  const validationRules: Record<string, FieldRule> = useMemo(
    () => ({
      firstname: {
        required: true,
        minLength: 2,
        message: "First name is required (minimum 2 characters)",
      },
      lastname: {
        required: true,
        minLength: 2,
        message: "Last name is required (minimum 2 characters)",
      },
      contactnumber: {
        required: true,
        pattern: /^\d{10}$/,
        message: "Contact number must be 10 digits",
      },
      emailId: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email format",
      },
    }),
    []
  );

  // Enhanced validation function using API validation
  const validateField = useCallback(
    (name: string, value: any): string => {
      // Use API validation for comprehensive checks
      const apiErrors = validateAccommodationInfoForm({
        bookingdate: "",
        traveldate: "",
        bookingstatus: "",
        costprice: "",
        sellingprice: "",
        confirmationNumber: "",
        checkindate: "",
        checkintime: "",
        checkoutdate: "",
        checkouttime: "",
        checkOutPeriod: "AM",
        pax: "",
        mealPlan: "",
        propertyName: "",
        propertyAddress: "",
        googleMapsLink: "",
        segments: [
          {
            id: "room-1",
            roomCategory: "",
            bedType: "",
          },
        ],
        accommodationType: "",
        voucher: null,
        taxinvoice: null,
        remarks: "",
      });
      if (apiErrors[name]) return apiErrors[name];

      const rule = validationRules[name as keyof typeof validationRules];
      if (!rule) return "";

      if (
        rule.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        return rule.message;
      }

      if (
        rule.minLength &&
        typeof value === "string" &&
        value.trim().length < rule.minLength
      ) {
        return rule.message;
      }

      if (
        rule.pattern &&
        typeof value === "string" &&
        !rule.pattern.test(value)
      ) {
        return rule.message;
      }

      return "";
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(
        fieldName,
        formData[fieldName as keyof AccommodationInfoFormData]
      );
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  // Normal handleChange that only updates local state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const processedValue =
      type === "number" && value !== "" ? Number(value) : value;

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Clear error when user types
    if (errors[name as keyof AccommodationInfoFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Mark field touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Enhanced blur handler with API validation
  const handleBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (showValidation) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }

      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    [validateField, showValidation]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (validateForm()) {
        onSubmit?.(formData);
      } else {
        // Mark all fields as touched to show validation errors
        const allTouched = Object.keys(validationRules).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);
      }
    },
    [formData, validateForm, onSubmit, validationRules]
  );

  // Enhanced input field component with validation indicators
  const InputField: React.FC<{
    name: keyof AccommodationInfoFormData;
    id?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    min?: number;
  }> = ({
    name,
    type = "text",
    placeholder,
    required,
    className = "",
    min,
  }) => {
    const isValidatingField = name === "bookingdate" && isValidating;
    const hasError = errors[name] && touched[name];
    const hasValue = formData[name] && String(formData[name]).trim();
    const isValid = hasValue && !hasError && !isValidatingField;

    return (
      <div className="relative">
        <input
          type={type}
          name={name}
          value={type === "file" ? undefined : String(formData[name] ?? "")}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          min={min}
          disabled={isSubmitting || isValidatingField}
          className={`
            w-full border rounded-md px-3 py-2 pr-10 text-sm transition-colors
            ${
              hasError
                ? "border-red-300 focus:ring-red-200"
                : isValid && touched[name]
                ? "border-green-300 focus:ring-green-200"
                : "border-gray-200 focus:ring-blue-200"
            }
            ${
              isSubmitting || isValidatingField
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
            ${className}
          `}
        />

        {/* Validation indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isValidatingField && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          )}
          {!isValidatingField && isValid && touched[name] && (
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {!isValidatingField && hasError && (
            <svg
              className="h-4 w-4 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        {hasError && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <form className="space-y-6 p-6 -mt-10" onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Booking and Travel Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 -mx-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Date
              </label>
              <input
                type="date"
                placeholder="DD-MM-YYYY"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                  <option>Select Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
                <MdKeyboardArrowDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mb-6 border border-gray-200 rounded-[12px] p-5 mt-6 -mx-5">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Amount</h3>

            {/* Cost Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowCostDropdown(!showCostDropdown)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {costPriceCurrency}
                    <MdKeyboardArrowDown className="h-4 w-4" />
                  </button>
                  {showCostDropdown && (
                    <div className="absolute z-10 mt-1 w-20 bg-white border border-gray-300 rounded-md shadow-lg">
                      <button
                        onClick={() => handleCurrencyChange("cost", "INR")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        INR
                      </button>
                      <button
                        onClick={() => handleCurrencyChange("cost", "USD")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        USD
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Cost Price"
                  className="flex px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {roeVisibleFor == "cost" && (
                  <>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-200">
                      ROE: {exchangeRate}
                    </button>
                    <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700">
                      INR: 0
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowSellingDropdown(!showSellingDropdown)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {sellingPriceCurrency}
                    <MdKeyboardArrowDown className="h-4 w-4" />
                  </button>
                  {showSellingDropdown && (
                    <div className="absolute z-10 mt-1 w-20 bg-white border border-gray-300 rounded-md shadow-lg">
                      <button
                        onClick={() => handleCurrencyChange("selling", "INR")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        INR
                      </button>
                      <button
                        onClick={() => handleCurrencyChange("selling", "USD")}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        USD
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter Selling Price"
                  className="flex px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {roeVisibleFor == "selling" && (
                  <>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-200">
                      ROE: {exchangeRate}
                    </button>
                    <div className="flex px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700">
                      INR: 0
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6 border border-gray-200 rounded-[12px] p-5 mt-6 -mx-5">
            <h1 className="text-sm font-medium text-gray-700 mb-4">
              Accommodation Info
            </h1>

            <hr className="-mt-3 mb-3 border-t border-gray-200" />

            {/* confirmation  number */}
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation Number
                </label>
                <div className="relative w-[350px]">
                  <input
                    type="text"
                    placeholder="Enter Confirmation Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {/* Check-in and Check-out Section */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Check-In Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-In Date
                </label>
                <input
                  type="text"
                  value={formData.checkindate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      checkindate: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Check-In Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-In Time
                </label>
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg py-1 w-fit">
                  <input
                    type="text"
                    value={formData.checkintime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        checkintime: e.target.value,
                      }))
                    }
                    placeholder="12:00"
                    className="w-20 px-2 py-1 text-center border-none focus:outline-none focus:ring-0 bg-transparent"
                  />
                  <select
                    value={formData.checkOutPeriod}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        checkOutPeriod: e.target.value as "AM" | "PM",
                      }))
                    }
                    className="px-2 py-1 border-none bg-transparent text-center focus:outline-none focus:ring-0"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Check-Out Date */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-15">
                  Check-Out Date
                </label>
                <input
                  type="text"
                  value={formData.checkoutdate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      checkoutdate: e.target.value,
                    }))
                  }
                  className="w-full ml-15 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Check-Out Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-15 ">
                  Check-Out Time
                </label>
                <div className="flex items-center bg-white border border-gray-300 rounded-lg py-1 ml-15 w-fit">
                  <input
                    type="text"
                    value={formData.checkouttime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        checkouttime: e.target.value,
                      }))
                    }
                    placeholder="11:00"
                    className="w-20 px-2 py-1 text-center border-none focus:outline-none focus:ring-0 bg-transparent"
                  />
                  <select
                    value={formData.checkOutPeriod}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        checkOutPeriod: e.target.value as "AM" | "PM",
                      }))
                    }
                    className="px-2 py-1 border-none bg-transparent text-center focus:outline-none focus:ring-0"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Pax */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pax
                </label>
                <input
                  type="text"
                  value={formData.pax}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pax: e.target.value }))
                  }
                  className="w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Select Meal Plan */}
              <div>
                <label className="block -ml-50 text-sm font-medium text-gray-700 mb-2">
                  Select Meal Plan
                </label>
                <select
                  value={formData.mealPlan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mealPlan: e.target.value,
                    }))
                  }
                  className="w-[300px] px-4 py-2 -ml-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="EPAI">EPAI</option>
                </select>
              </div>
            </div>

            <div className="mb-6 border border-gray-200 rounded-[12px] p-5 mt-6 ">
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Accommodation Type
                  </label>
                  <div className="relative w-[300px]">
                    <select
                      defaultValue=""
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accommodationType: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="" disabled>
                        Select Stay Type
                      </option>
                      <option>Hotel</option>
                      <option>Resort</option>
                      <option>Hostel</option>
                      <option>Villa</option>
                    </select>

                    <MdKeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2  h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {formData.accommodationType && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.accommodationType} Name
                    </label>
                    <input
                      type="text"
                      value={formData.propertyName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          propertyName: e.target.value,
                        }))
                      }
                      placeholder="Enter Hotel Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.accommodationType} Address
                    </label>
                    <input
                      type="text"
                      value={formData.propertyAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          propertyAddress: e.target.value,
                        }))
                      }
                      placeholder="Enter Hotel Address"
                      className="w-full mr-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps Link
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={formData.googleMapsLink}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            googleMapsLink: e.target.value,
                          }))
                        }
                        placeholder="Paste Google Maps Link"
                        className="w-[733px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => voucherRef.current?.click()}
                        className="px-3 py-2 flex gap-1  bg-[#126ACB] text-white rounded-md text-sm hover:bg-blue-700"
                      >
                        <MdOutlineFileUpload size={20} /> Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formData.accommodationType === "Hotel" && (
                <HotelLayout
                  segments={formData.segments}
                  onSegmentsChange={handleSegmentsChange}
                />
              )}

              {formData.accommodationType === "Resort" && (
                <HotelLayout
                  segments={formData.segments}
                  onSegmentsChange={handleSegmentsChange}
                />
              )}

              {formData.accommodationType === "Hostel" && (
                <HotelLayout
                  segments={formData.segments}
                  onSegmentsChange={handleSegmentsChange}
                />
              )}

              {formData.accommodationType === "Villa" && (
                <VillaLayout
                  segments={formData.segments}
                  onSegmentsChange={handleSegmentsChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* Vendor Docs */}

        <div className="border border-gray-200 rounded-[12px] p-5 -mt-10">
          <h2>Vendor Documents</h2>
          <hr className="mt-1 mb-2 border-t border-gray-200" />

          <div className="flex flex-col gap-6 mt-2">
            <div className="flex gap-5">
              <div className="flex flex-col gap-1 w-full">
                <label className="block text-sm text-gray-500 mt-2">
                  Voucher <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <div className="w-[250px]">
                    <input
                      type="text"
                      placeholder="Enter Voucher"
                      className="w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="file"
                    ref={voucherRef}
                    className="hidden"
                    onChange={() => handleFileChange("voucher")}
                  />
                  <button
                    type="button"
                    onClick={() => voucherRef.current?.click()}
                    className="px-3 py-2 -mt-1 flex gap-1  bg-[#126ACB] text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    <MdOutlineFileUpload size={20} /> Upload
                  </button>
                  {filesAdded.voucher && (
                    <div className="text-sm text-green-600 mt-1">
                      {" "}
                      File has been added{" "}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="block text-sm text-gray-500 mt-2">
                  Tax Invoice <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <div className="w-[250px]">
                    <input
                      type="text"
                      placeholder="Enter Invoice"
                      className="w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="file"
                    ref={taxinvoiceRef}
                    className="hidden"
                    onChange={() => handleFileChange("taxinvoice")}
                  />
                  <button
                    type="button"
                    onClick={() => taxinvoiceRef.current?.click()}
                    className="px-3 py-2 -mt-1 flex gap-1 bg-[#126ACB] text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    <MdOutlineFileUpload size={20} /> Upload
                  </button>
                  {filesAdded.taxinvoice && (
                    <div className="text-sm text-green-600 mt-1">
                      {" "}
                      File has been added{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-[12px] p-4">
          <label className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <hr className="mt-1 mb-2 border-t border-gray-200" />
          <textarea
            name="remarks"
            rows={5}
            value={formData.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Your Remarks Here"
            disabled={isSubmitting}
            className={`
            w-full border border-gray-200 rounded-md px-3 py-2 text-sm mt-2 transition-colors
            focus:ring focus:ring-blue-200
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
          `}
          />
        </div>

        {/* Submit Button (if standalone) */}

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-right  bg-[#114958] text-white rounded-lg hover:bg-[#0d3a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default React.memo(AccommodationServiceInfoForm);
