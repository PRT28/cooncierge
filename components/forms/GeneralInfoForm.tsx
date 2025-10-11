"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { BsPlusSquareFill } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { validateGeneralInfo } from "@/services/bookingApi";
import { useBooking } from "@/context/BookingContext";

// Type definitions
interface GeneralInfoFormData {
  customer: string;
  vendor: string;
  adults: number;
  children: number;
  infants: number;
  traveller1: string;
  traveller2: string;
  traveller3: string;
  bookingOwner: string;
  remarks: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface GeneralInfoFormProps {
  formData?: Partial<GeneralInfoFormData>;
  onFormDataUpdate?: (data: Partial<GeneralInfoFormData>) => void;
  onSubmit?: (data: GeneralInfoFormData) => void;
  isSubmitting?: boolean;
  showValidation?: boolean;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({
  formData: externalFormData = {},
  onFormDataUpdate,
  onSubmit,
  isSubmitting = false,
  showValidation = true,
}) => {
  // Internal form state
  const [formData, setFormData] = useState<GeneralInfoFormData>({
    customer: "",
    vendor: "",
    adults: 0,
    children: 0,
    infants: 0,
    traveller1: "",
    traveller2: "",
    traveller3: "",
    bookingOwner: "",
    remarks: "",
    ...externalFormData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validatingCustomer, setValidatingCustomer] = useState<boolean>(false);
  const [validatingVendor, setValidatingVendor] = useState<boolean>(false);
  const { openAddCustomer, openAddVendor } = useBooking();

  // Get validation functions from booking context
  const { validateCustomer, validateVendor } = useBooking();

  // Validation rules
  const validationRules = useMemo(
    () => ({
      customer: {
        required: true,
        minLength: 2,
        message: "Customer name is required (minimum 2 characters)",
      },
      vendor: {
        required: true,
        minLength: 2,
        message: "Vendor name is required (minimum 2 characters)",
      },
      adults: {
        required: true,
        minLength: 1,
        message: "At least 1 adult is required",
      },
      traveller1: {
        required: true,
        minLength: 2,
        message: "Lead passenger name is required",
      },
      bookingOwner: {
        required: true,
        minLength: 2,
        message: "Booking owner is required",
      },
    }),
    []
  );

  // Enhanced validation function using API validation
  const validateField = useCallback(
    (name: string, value: any): string => {
      // Use API validation for comprehensive checks
      if (name === "customer" || name === "vendor") {
        const apiErrors = validateGeneralInfo({ [name]: value });
        return apiErrors[name] || "";
      }

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
        value.length < rule.minLength
      ) {
        return rule.message;
      }

      if (
        rule.minLength &&
        typeof value === "number" &&
        value < rule.minLength
      ) {
        return rule.message;
      }

      return "";
    },
    [validationRules]
  );

  // Customer validation handler
  const handleCustomerValidation = useCallback(
    async (customerId: string) => {
      if (!customerId.trim()) return;

      setValidatingCustomer(true);
      try {
        const isValid = await validateCustomer(customerId);
        if (!isValid) {
          setErrors((prev) => ({
            ...prev,
            customer: "Customer not found or invalid",
          }));
        } else {
          setErrors((prev) => ({ ...prev, customer: "" }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          customer: "Error validating customer",
        }));
      } finally {
        setValidatingCustomer(false);
      }
    },
    [validateCustomer]
  );

  // Vendor validation handler
  const handleVendorValidation = useCallback(
    async (vendorId: string) => {
      if (!vendorId.trim()) return;

      setValidatingVendor(true);
      try {
        const isValid = await validateVendor(vendorId);
        if (!isValid) {
          setErrors((prev) => ({
            ...prev,
            vendor: "Vendor not found or invalid",
          }));
        } else {
          setErrors((prev) => ({ ...prev, vendor: "" }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, vendor: "Error validating vendor" }));
      } finally {
        setValidatingVendor(false);
      }
    },
    [validateVendor]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(
        fieldName,
        formData[fieldName as keyof GeneralInfoFormData]
      );
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField, validationRules]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const processedValue = type === "number" ? value : value;

    // build next state from current formData
    const next = { ...formData, [name]: processedValue };
    setFormData(next);

    onFormDataUpdate?.(next);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Enhanced blur handler with API validation
  const handleBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (showValidation) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));

        // Trigger API validation for customer and vendor
        if (name === "customer" && value.trim()) {
          await handleCustomerValidation(value.trim());
        } else if (name === "vendor" && value.trim()) {
          await handleVendorValidation(value.trim());
        }
      }

      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    [
      validateField,
      showValidation,
      handleCustomerValidation,
      handleVendorValidation,
    ]
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

  // Sync with external form data
  useEffect(() => {
    if (externalFormData && Object.keys(externalFormData).length > 0) {
      setFormData((prev) => ({ ...prev, ...externalFormData }));
    }
  }, [externalFormData]);

  // Memoized traveller count
  const totalTravellers = useMemo(
    () => formData.adults + formData.children + formData.infants,
    [formData.adults, formData.children, formData.infants]
  );

  // Enhanced input field component with validation indicators
  const InputField: React.FC<{
    name: keyof GeneralInfoFormData;
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
    const isValidating =
      (name === "customer" && validatingCustomer) ||
      (name === "vendor" && validatingVendor);
    const hasError = errors[name] && touched[name];
    const hasValue = formData[name] && String(formData[name]).trim();
    const isValid = hasValue && !hasError && !isValidating;

    return (
      <div className="relative">
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          min={min}
          disabled={isSubmitting || isValidating}
          className={`
            w-full border rounded-md px-3 py-2 pr-10 text-sm transition-colors
            ${
              hasError
                ? "border-red-300 focus:ring-red-200"
                : isValid
                ? "border-green-300 focus:ring-green-200"
                : "border-gray-200 focus:ring-blue-200"
            }
            ${
              isSubmitting || isValidating
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
            ${className}
          `}
        />

        {/* Validation indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isValidating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          )}
          {!isValidating && isValid && (
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
          {!isValidating && hasError && (
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
    <form className="space-y-6 p-6" onSubmit={handleSubmit}>
      {/* Customer Section */}
      <div className="border border-gray-200 rounded-[12px] p-4 mt-[-20px] ">
        <h2 className="mt-[-5px]">Billed To</h2>
        <hr className="mt-1 mb-2 border-t border-gray-200" />
        <label className="block text-sm font-medium text-gray-700">
          Name / Customer ID <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center mt-1 w-full">
          <div className="w-[600px]">
            <InputField
              name="customer"
              placeholder="Search by Customer Name/ID"
              required
              className=" w-full"
            />
          </div>
          <div className="flex space-x-2 ml-auto">
            <button
              type="button"
              className="w-7 h-7 mt-1.5 flex items-center justify-center hover:bg-gray-200 rounded-md bg-gray-100  transition-colors"
              aria-label="View customer details"
            >
              <IoEye size={22} className="text-gray-700" />
            </button>
            <button
              type="button"
              onClick={openAddCustomer}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-md  transition-colors"
              aria-label="Add new customer"
            >
              <BsPlusSquareFill size={26} className="" />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="mt-2 flex gap-1 text-[#818181] text-[14px] hover:text-gray-800 transition-colors"
        >
          <CiCirclePlus size={20} /> Add Another Customer
        </button>
      </div>

      {/* Vendor Section */}
      <div className="border border-gray-200 rounded-[12px] p-4">
        <h2 className="mt-[-5px]">Vendors</h2>
        <hr className="mt-1 mb-2 border-t border-gray-200" />

        <label className="block text-sm font-medium text-gray-700">
          Name / Vendor ID <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center gap-2 mt-1">
          <div className="w-[600px]">
            <InputField
              name="vendor"
              placeholder="Search by Vendor Name/ID"
              required
              className="w-full"
            />
          </div>
          <div className="flex space-x-2 ml-auto">
            <button
              type="button"
              className="w-7 h-7 mt-1.5 flex items-center justify-center hover:bg-gray-200 rounded-md bg-gray-100  transition-colors"
              aria-label="View customer details"
            >
              <IoEye size={22} className="text-gray-700" />
            </button>
            <button
              type="button"
              onClick={openAddVendor}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-md  transition-colors"
              aria-label="Add new vendor"
            >
              <BsPlusSquareFill size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* Travellers Section */}
      <div className="border border-gray-200 rounded-[12px] p-4">
        <h2 className="mt-[-5px]">Travellers</h2>
        <hr className="mt-1 mb-2 border-t border-gray-200" />

        <div className="flex gap-6 mt-3">
          <div>
            <label className="block text-xs text-gray-500">Adults *</label>
            <div className="flex items-center border border-gray-300 rounded-2xl px-2 py-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    adults: Math.max(1, formData.adults - 1),
                  })
                }
                className="px-1 text-lg font-semibold"
              >
                <FiMinus size={15} />
              </button>
              <span className="px-2">{formData.adults}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, adults: formData.adults + 1 })
                }
                className="px-1 text-lg font-semibold"
              >
                <GoPlus size={15} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Children</label>
            <button className="align-items-center border border-gray-200 border-radius-2 rounded-2xl px-6 py-2 text-sm">
              ADD
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Infants</label>
            <div className="flex items-center border border-gray-300 rounded-2xl px-1 py-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    infants: Math.max(0, formData.infants - 1),
                  })
                }
                className="px-2 text-lg font-semibold"
              >
                <FiMinus size={15} />
              </button>
              <span className="px-2">{formData.infants}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, infants: formData.infants + 1 })
                }
                className="px-2 text-lg font-semibold"
              >
                <GoPlus size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Traveller Details */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-1">
            <div className="w-[600px]">
              <InputField
                name="traveller1"
                placeholder="Adult 1 (Lead Pax) *"
                required
                className="flex-1"
              />
            </div>
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                className="w-7 h-7 mt-1.5 flex items-center justify-center hover:bg-gray-200 rounded-md bg-gray-100  transition-colors"
                aria-label="View customer details"
              >
                <IoEye size={22} className="text-gray-700" />
              </button>
              <button
                type="button"
                className="w-10 h-10 -ml-2 flex items-center justify-center rounded-md  transition-colors"
              >
                <BsPlusSquareFill size={26} />
              </button>
            </div>
          </div>

          {formData.adults > 1 && (
            <div className="flex items-center gap-1">
              <div className="w-[600px]">
                <InputField
                  name="traveller2"
                  placeholder="Adult 2"
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-2 ml-auto">
                <button
                  type="button"
                  className="w-7 h-7 mt-1.5 flex items-center justify-center hover:bg-gray-200 rounded-md bg-gray-100  transition-colors"
                  aria-label="View customer details"
                >
                  <IoEye size={22} className="text-gray-700" />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 -ml-2 flex items-center justify-center rounded-md  transition-colors"
                >
                  <BsPlusSquareFill size={26} />
                </button>
              </div>
            </div>
          )}

          {formData.infants > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-[600px]">
                <InputField
                  name="traveller3"
                  placeholder="Infant 1"
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-2 ml-auto">
                <button
                  type="button"
                  className="w-7 h-7 mt-1.5 flex items-center justify-center hover:bg-gray-200 rounded-md bg-gray-100  transition-colors"
                  aria-label="View customer details"
                >
                  <IoEye size={22} className="text-gray-700" />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 -ml-2 flex items-center justify-center rounded-md  transition-colors"
                >
                  <BsPlusSquareFill size={26} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Owner */}
      <div className="border border-gray-200 rounded-[12px] p-4">
        <label className="block text-sm font-medium text-gray-700">
          Booking Owner <span className="text-red-500">*</span>
        </label>
        <hr className="mt-1 mb-2 border-t border-gray-200" />
        <InputField
          name="bookingOwner"
          placeholder="Owner Name"
          required
          className="mt-1"
        />
      </div>

      {/* Remarks */}
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
      {onSubmit && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#114958] text-white rounded-lg hover:bg-[#0d3a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save General Info"}
          </button>
        </div>
      )}
    </form>
  );
};

export default React.memo(GeneralInfoForm);
