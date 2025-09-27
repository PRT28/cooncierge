/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { validateCustomerForm } from "@/services/bookingApi";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import SideSheet from "@/components/SideSheet";
import { useBooking } from "@/context/BookingContext";
import { useRef } from "react";
// Type definitions
interface CustomerFormData {
  firstname: string;
  lastname: string;
  nickname: string;
  contactnumber: number | "";
  emailId: string;
  dateofbirth: number | "";
  gstin: number | "";
  companyname: string;
  adhaarnumber: number | "";
  pan: number | string;
  passport: number | string;
  billingaddress: string | number;
  remarks: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface AddNewCustomerFormProps {
  onSubmit?: (data: CustomerFormData) => void;
  isSubmitting?: boolean;
  showValidation?: boolean;
}

const AddNewCustomerForm: React.FC<AddNewCustomerFormProps> = ({
  onSubmit,
  isSubmitting = false,
  showValidation = true,
}) => {
  // Internal form state
  const [formData, setFormData] = useState<CustomerFormData>({
    firstname: "",
    lastname: "",
    nickname: "",
    contactnumber: "",
    emailId: "",
    dateofbirth: "",
    gstin: "",
    companyname: "",
    adhaarnumber: "",
    pan: "",
    passport: "",
    billingaddress: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const { isAddCustomerOpen, closeAddCustomer } = useBooking();
  const adhaarRef = useRef<HTMLInputElement | null>(null);
  const panref = useRef<HTMLInputElement | null>(null);
  const passportref = useRef<HTMLInputElement | null>(null);
  const [filesAdded, setFilesAdded] = useState({
    adhaar: false,
    pan: false,
    passport: false,
  });

  const handleFileChange = (field: "adhaar" | "pan" | "passport") => {
    let ref: React.RefObject<HTMLInputElement | null>;
    if (field === "adhaar") ref = adhaarRef;
    else if (field === "pan") ref = panref;
    else ref = passportref;

    const file = ref.current?.files?.[0];
    setFilesAdded((prev) => ({
      ...prev,
      [field]: !!file,
    }));
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
      const apiErrors = validateCustomerForm({
        [name]: value,
        firstname: "",
        lastname: "",
        nickname: "",
        contactnumber: 0,
        emailId: "",
        dateofbirth: 0,
        gstin: 0,
        companyname: "",
        adhaarnumber: 0,
        pan: "",
        passport: "",
        billingaddress: "",
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
        formData[fieldName as keyof CustomerFormData]
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
    if (errors[name as keyof CustomerFormData]) {
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
    name: keyof CustomerFormData;
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
    const isValidatingField = name === "firstname" && isValidating; // Example for one field, can be extended
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
    <SideSheet
      isOpen={isAddCustomerOpen}
      onClose={closeAddCustomer}
      title={"Add Customer"}
      width="xl"
    >
      <form className="space-y-6 p-6" onSubmit={handleSubmit}>
        {/* Customer Section */}
        <div className="border border-gray-200 rounded-[12px] p-4">
          <h2>Basic Details</h2>
          <hr className="mt-1 mb-4 border-t border-gray-200" />

          {/* First row: 3 fields side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <InputField
                name="firstname"
                placeholder="Enter First Name"
                required
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <InputField
                name="lastname"
                placeholder="Enter Last Name"
                required
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Nickname/Alias <span className="text-red-500">*</span>
              </label>
              <InputField
                name="nickname"
                placeholder="Enter Nickname/Alias"
                required
                className="flex-1"
              />
            </div>
          </div>

          {/* Second row: next 3 fields side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number <span className="text-red-500">*</span>
              </label>

              <InputField
                name="contactnumber"
                placeholder="Enter Contact Number"
                required
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Email ID <span className="text-red-500">*</span>
              </label>
              <InputField
                name="emailId"
                placeholder="Enter Email ID"
                required
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <InputField
                name="dateofbirth"
                placeholder="DD-MM-YYYY"
                required
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="border border-gray-200 rounded-[12px] p-4">
          <h2>Company Details (Optional)</h2>
          <hr className="mt-1 mb-2 border-t border-gray-200" />
          <label className="block text-sm font-medium text-gray-700 mt-2">
            GSTIN
          </label>

          <div className="flex items-center mt-1">
            <div className="flex ">
              <div className="w-[300px]">
                <InputField
                  name="gstin"
                  placeholder="Please Provide Your GST No."
                  required
                  className="w-full"
                />
              </div>

              <button
                type="button"
                className="px-2 py-2 w-25 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800 relative z-10 "
              >
                Fetch
              </button>
            </div>
          </div>

          <div className=" ml-115 mt-[-70px]">
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-[-5px]">
              Company Name
            </label>

            <div className="flex items-center gap-2 mt-2 w-full">
              <div className="w-[300px]">
                <InputField
                  name="companyname"
                  placeholder="Enter Company Name"
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        {/* ID Proofs Section */}
        <div className="border border-gray-200 rounded-[12px] p-4">
          <h2>ID Proofs</h2>
          <hr className="mt-1 mb-2 border-t border-gray-200" />

          <div className="flex flex-col gap-6 mt-3">
            <div className="flex gap-5">
              <div className="flex flex-col gap-1 w-full">
                <label className="block text-xs text-gray-500 mt-2">
                  ADHAAR <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <div className="w-[300px]">
                    <InputField
                      id="adhaaruploader"
                      name="adhaarnumber"
                      type="text"
                      placeholder="Enter ADHAAR Number"
                      required
                      className="w-full"
                    />
                  </div>
                  <input
                    type="file"
                    ref={adhaarRef}
                    className="hidden"
                    onChange={() => handleFileChange("adhaar")}
                  />
                  <button
                    type="button"
                    onClick={() => adhaarRef.current?.click()}
                    className="px-3 py-2 flex gap-1 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800"
                  >
                    <MdOutlineFileUpload size={20} /> Upload
                  </button>
                  {filesAdded.adhaar && (
                    <div className="text-sm text-green-600 mt-1">
                      {" "}
                      File has been added{" "}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="block text-xs text-gray-500 mt-2">
                  PAN CARD <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <div className="w-[300px]">
                    <InputField
                      name="pan"
                      placeholder="Enter PAN Number"
                      required
                      type="number"
                      className="w-full"
                    />
                  </div>
                  <input
                    type="file"
                    ref={panref}
                    className="hidden"
                    onChange={() => handleFileChange("pan")}
                  />
                  <button
                    type="button"
                    onClick={() => panref.current?.click()}
                    className="px-3 py-2 flex gap-1 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800"
                  >
                    <MdOutlineFileUpload size={20} /> Upload
                  </button>
                  {filesAdded.pan && (
                    <div className="text-sm text-green-600 mt-1">
                      {" "}
                      File has been added{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="block text-xs text-gray-500">
                Passport <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center w-full">
                <div className="w-[300px]">
                  <InputField
                    name="passport"
                    placeholder="Enter Passport Number"
                    required
                    type="number"
                    className="flex-1 w-full"
                  />
                </div>
                <input
                  type="file"
                  ref={passportref}
                  className="hidden"
                  onChange={() => handleFileChange("passport")}
                />
                <button
                  type="button"
                  onClick={() => passportref.current?.click()}
                  className="px-3 py-2 flex gap-1 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800"
                >
                  <MdOutlineFileUpload size={20} /> Upload
                </button>
                {filesAdded.passport && (
                  <div className="text-sm text-green-600 mt-1">
                    {" "}
                    File has been added{" "}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-[12px] p-4">
          <label className="block text-sm font-medium text-gray-700">
            Billing Address
          </label>
          <hr className="mt-1 mb-2 border-t border-gray-200" />
          <button
            type="button"
            className="px-3 flex gap-1 py-2 mt-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800"
          >
            {" "}
            <CiCirclePlus size={20} /> Billing Address{" "}
          </button>
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
    </SideSheet>
  );
};

export default React.memo(AddNewCustomerForm);
