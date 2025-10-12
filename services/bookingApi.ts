"use client";

import type { AxiosError } from 'axios';
import apiClient from '@/services/apiClient';
import { getAuthUser } from '@/services/storage/authStorage';

// Type definitions
interface Service {
  id: string;
  title: string;
  image: string;
  category: 'travel' | 'accommodation' | 'transport' | 'activity';
  description?: string;
}

interface GeneralInfo {
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

interface CustomerFrom {
  firstname: string;
  lastname: string;
  nickname: string;
  contactnumber: number;
  emailId: string;
  dateofbirth: number;
  gstin: number;
  companyname: string;
  adhaarnumber: number;
  pan: number | string;
  passport: number | string;
  billingaddress: string | number;
  remarks: string;
}

interface VendorForm {
  companyname: string;
  companyemail: string;
  contactnumber: number;
  gstin: number;
  firstname: string;
  lastname: string;
  nickname: string;
  emailId: string;
  dateofbirth: number;
  document: number | "";
  billingaddress: string | number;
  remarks: string;
}

interface FlightSegment {
  id: string;
  flightnumber: number | string;
  traveldate: string;
  cabinclass: "Economy" | "Premium Economy" | "Business" | "First Class" | string;
   pnr?: string;
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
     pnr?: string;
}

interface FlightInfoForm {
  bookingdate: string;
  traveldate: string; // This can be the main/first travel date
  bookingstatus: "Confirmed" | "Canceled" | "In Progress" | string;
  costprice: number | string;
  sellingprice: number | string;
  PNR: number | string;
  pnrEnabled: boolean;
  segments: FlightSegment[]; // Array of flight segments
  returnSegments: ReturnFlightSegment[]; // array for return segments
  
  samePNRForAllSegments: boolean; // For the toggle
  flightType: "One Way" | "Round Trip" | "Multi-City"; // For the flight type tabs
  voucher: File | null;
  taxinvoice: File | null;
  remarks: string;
}

interface AccommodationInfoForm {
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


interface ServiceInfo {
  serviceType: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  budget: number;
  preferences: string;
  specialRequests: string;
  priority: 'low' | 'medium' | 'high';
  flexibility: boolean;
}

interface BookingData {
  service: Service;
  generalInfo: GeneralInfo;
  serviceInfo: ServiceInfo;
  customerform: CustomerFrom;
  vendorform: VendorForm;
  flightinfoform: FlightInfoForm;
  timestamp: string;
}

export interface DraftBooking extends Partial<BookingData> {
  id: string;
  draftName: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed';
  completedQuotationId?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string> | undefined;
}

interface QuotationPayload {
  quotationType: string;
  channel: 'B2C' | 'B2B';
  partyId: string;
  formFields: Record<string, unknown>;
  totalAmount: number;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
}

interface BackendQuotation {
  id?: string;
  _id?: string;
  quotationType: string;
  channel: string;
  partyId: string;
  formFields: Record<string, unknown>;
  totalAmount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Configuration moved to services/apiClient.ts

// LocalStorage Draft Management
const DRAFT_STORAGE_KEY = 'booking_drafts';

export class DraftManager {
  // Generate unique ID for drafts
  private static generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Get all drafts from localStorage
  static getAllDrafts(): DraftBooking[] {
    try {
      if (typeof window === 'undefined') return [];
      const drafts = localStorage.getItem(DRAFT_STORAGE_KEY);
      return drafts ? JSON.parse(drafts) : [];
    } catch (error) {
      console.error('Error reading drafts from localStorage:', error);
      return [];
    }
  }

  // Save draft to localStorage
  static saveDraft(bookingData: Partial<BookingData>, draftName?: string): DraftBooking {
    try {
      const drafts = this.getAllDrafts();
      const now = new Date().toISOString();

      // Check if this is an update to existing draft
      const existingDraftIndex = drafts.findIndex(draft =>
        draft.service?.id === bookingData.service?.id &&
        draft.generalInfo?.customer === bookingData.generalInfo?.customer
      );

      const existingDraft = existingDraftIndex >= 0 ? drafts[existingDraftIndex] : null;
      const draftId = existingDraft?.id || this.generateId();

      const draft: DraftBooking = {
        id: draftId,
        draftName: draftName || `Draft - ${bookingData.service?.title || 'Unknown Service'}`,
        createdAt: existingDraft?.createdAt || now,
        updatedAt: now,
        status: 'draft',
        ...bookingData,
        timestamp: now,
      };

      if (existingDraftIndex >= 0) {
        drafts[existingDraftIndex] = draft;
      } else {
        drafts.push(draft);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
      }

      return draft;
    } catch (error) {
      console.error('Error saving draft to localStorage:', error);
      throw new Error('Failed to save draft');
    }
  }

  // Get draft by ID
  static getDraftById(id: string): DraftBooking | null {
    const drafts = this.getAllDrafts();
    return drafts.find(draft => draft.id === id) || null;
  }

  // Delete draft from localStorage
  static deleteDraft(id: string): boolean {
    try {
      const drafts = this.getAllDrafts();
      const filteredDrafts = drafts.filter(draft => draft.id !== id);

      if (typeof window !== 'undefined') {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts));
      }

      return true;
    } catch (error) {
      console.error('Error deleting draft from localStorage:', error);
      return false;
    }
  }

  // Mark draft as completed and optionally delete it
  static completeDraft(draftId: string, quotationId: string, deleteAfterCompletion = true): boolean {
    try {
      const drafts = this.getAllDrafts();
      const draftIndex = drafts.findIndex(draft => draft.id === draftId);

      if (draftIndex >= 0) {
        if (deleteAfterCompletion) {
          // Delete the draft since it's completed
          drafts.splice(draftIndex, 1);
        } else {
          // Mark as completed but keep for reference
          const draft = drafts[draftIndex];
          if (draft) {
            draft.status = 'completed';
            draft.completedQuotationId = quotationId;
            draft.updatedAt = new Date().toISOString();
          }
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error completing draft:', error);
      return false;
    }
  }

  // Clear all drafts
  static clearAllDrafts(): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
      return true;
    } catch (error) {
      console.error('Error clearing all drafts:', error);
      return false;
    }
  }

  // Get drafts count
  static getDraftsCount(): number {
    return this.getAllDrafts().length;
  }

  // Search drafts by service type or customer name
  static searchDrafts(query: string): DraftBooking[] {
    const drafts = this.getAllDrafts();
    const lowercaseQuery = query.toLowerCase();

    return drafts.filter(draft =>
      draft.draftName?.toLowerCase().includes(lowercaseQuery) ||
      draft.service?.title?.toLowerCase().includes(lowercaseQuery) ||
      draft.generalInfo?.customer?.toLowerCase().includes(lowercaseQuery) ||
      draft.serviceInfo?.destination?.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Validation utilities
export const validateGeneralInfo = (data: Partial<GeneralInfo>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.customer?.trim()) {
    errors.customer = 'Customer name is required';
  } else if (data.customer.length < 2) {
    errors.customer = 'Customer name must be at least 2 characters';
  }

  if (!data.vendor?.trim()) {
    errors.vendor = 'Vendor name is required';
  } else if (data.vendor.length < 2) {
    errors.vendor = 'Vendor name must be at least 2 characters';
  }

  if (!data.adults || data.adults < 1) {
    errors.adults = 'At least 1 adult is required';
  }

  if (data.adults && data.adults > 20) {
    errors.adults = 'Maximum 20 adults allowed';
  }

  if (!data.traveller1?.trim()) {
    errors.traveller1 = 'Lead passenger name is required';
  }

  if (!data.bookingOwner?.trim()) {
    errors.bookingOwner = 'Booking owner is required';
  }

  return errors;
};

export const validateServiceInfo = (data: Partial<ServiceInfo>, service?: Service): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.destination?.trim()) {
    errors.destination = 'Destination is required';
  }

  if (!data.departureDate) {
    errors.departureDate = 'Departure date is required';
  } else {
    const departureDate = new Date(data.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departureDate < today) {
      errors.departureDate = 'Departure date cannot be in the past';
    }
  }

  if (service?.category === 'travel' && !data.returnDate) {
    errors.returnDate = 'Return date is required for travel services';
  }

  if (data.departureDate && data.returnDate) {
    const departureDate = new Date(data.departureDate);
    const returnDate = new Date(data.returnDate);

    if (returnDate <= departureDate) {
      errors.returnDate = 'Return date must be after departure date';
    }
  }

  if (!data.budget || data.budget <= 0) {
    errors.budget = 'Budget must be greater than 0';
  }

  if (data.budget && data.budget > 10000000) {
    errors.budget = 'Budget cannot exceed ₹1,00,00,000';
  }

  return errors;
};

export const validateCustomerForm = (data: CustomerFrom): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.firstname?.trim()) {
    errors.firstname = 'First name is required';
  }

  if (!data.lastname?.trim()) {
    errors.lastname = 'Last name is required';
  }

  if (!data.contactnumber) {
    errors.contactnumber = 'Contact number is required';
  } else if (!/^\d{10}$/.test(String(data.contactnumber))) {
    errors.contactnumber = 'Contact number must be 10 digits';
  }

  if (!data.emailId?.trim()) {
    errors.emailId = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.emailId)) {
    errors.emailId = 'Email address is invalid';
  }

  if (data.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(String(data.gstin))) {
    errors.gstin = 'Invalid GSTIN format';
  }

  if (data.adhaarnumber && !/^\d{12}$/.test(String(data.adhaarnumber))) {
    errors.adhaarnumber = 'Aadhaar number must be 12 digits';
  }

  if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(data.pan))) {
    errors.pan = 'Invalid PAN format';
  }

  if (data.passport && !/^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$/.test(String(data.passport))) {
    errors.passport = 'Invalid Passport number format';
  }

  if (!data.billingaddress) {
    errors.billingaddress = 'Billing address is required';
  }

  if (data.dateofbirth) {
    if (new Date(data.dateofbirth) > new Date()) {
      errors.dateofbirth = 'Date of birth cannot be in the future';
    }
  }

  return errors;
};

export const validateVendorForm = (data: VendorForm): Record<string, string> => {
  const errors: Record<string, string> = {};

 
  if (!data.companyname?.trim()) {
    errors.companyname = "Company name is required";
  }

  if (!data.companyemail?.trim()) {
    errors.companyemail = "Company email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.companyemail)) {
    errors.companyemail = "Company email address is invalid";
  }

  
  if (!data.contactnumber) {
    errors.contactnumber = "Contact number is required";
  } else if (!/^\d{10}$/.test(String(data.contactnumber))) {
    errors.contactnumber = "Contact number must be 10 digits";
  }

  
  if (data.gstin && 
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        .test(String(data.gstin))) {
    errors.gstin = "Invalid GSTIN format";
  }

  
  if (!data.firstname?.trim()) {
    errors.firstname = "First name is required";
  }

  if (!data.lastname?.trim()) {
    errors.lastname = "Last name is required";
  }

  if (!data.emailId?.trim()) {
    errors.emailId = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.emailId)) {
    errors.emailId = "Email address is invalid";
  }

  
  if (data.dateofbirth) {
    if (new Date(data.dateofbirth) > new Date()) {
      errors.dateofbirth = "Date of birth cannot be in the future";
    }
  }

  if (!data.document) {
    errors.document = "Document is required";
  }

  
  if (!data.billingaddress || String(data.billingaddress).trim() === "") {
    errors.billingaddress = "Billing address is required";
  }

  return errors;
};

export const validateFlightInfoForm = (data: FlightInfoForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.bookingdate?.trim()) {
    errors.bookingdate = "Booking date is required";
  }

  if (!data.traveldate?.trim()) {
    errors.traveldate = "Travel date is required";
  } else if (new Date(data.traveldate) < new Date(data.bookingdate)) {
    errors.traveldate = "Travel date cannot be before booking date";
  }

  if (!data.bookingstatus?.trim()) {
    errors.bookingstatus = "Booking status is required";
  }

  if (data.costprice === "" || data.costprice === null || isNaN(Number(data.costprice))) {
    errors.costprice = "Cost price must be a valid number";
  }

  if (data.sellingprice === "" || data.sellingprice === null || isNaN(Number(data.sellingprice))) {
    errors.sellingprice = "Selling price must be a valid number";
  }

  if (!data.PNR && data.PNR !== 0) {
    errors.PNR = "PNR is required";
  } else if (!/^[A-Z0-9]{5,10}$/i.test(String(data.PNR))) {
    errors.PNR = "PNR must be 5–10 alphanumeric characters";
  }

  // Validate segments array
  if (!data.segments || data.segments.length === 0) {
    errors.segments = "At least one flight segment is required";
  } else {
    // Validate each segment
    data.segments.forEach((segment, index) => {
      const segmentPrefix = `segments[${index}]`;

      if (!segment.flightnumber && segment.flightnumber !== 0) {
        errors[`${segmentPrefix}.flightnumber`] = `Flight number is required for segment ${index + 1}`;
      } else if (!/^[0-9]{2,6}$/.test(String(segment.flightnumber))) {
        errors[`${segmentPrefix}.flightnumber`] = `Flight number must be 2–6 digits for segment ${index + 1}`;
      }

      if (!segment.traveldate?.trim()) {
        errors[`${segmentPrefix}.traveldate`] = `Travel date is required for segment ${index + 1}`;
      } else if (new Date(segment.traveldate) < new Date(data.bookingdate)) {
        errors[`${segmentPrefix}.traveldate`] = `Travel date cannot be before booking date for segment ${index + 1}`;
      }

      if (!segment.cabinclass?.trim()) {
        errors[`${segmentPrefix}.cabinclass`] = `Cabin class is required for segment ${index + 1}`;
      }
    });
  }

  // Flight type validation (optional, but good to have)
  if (!data.flightType) {
    errors.flightType = "Flight type is required";
  }

  if (!data.voucher) {
    errors.voucher = "Voucher file is required";
  }

  if (!data.taxinvoice) {
    errors.taxinvoice = "Tax invoice file is required";
  }

  if (data.remarks && data.remarks.length > 500) {
    errors.remarks = "Remarks cannot exceed 500 characters";
  }

  return errors;
};

export const validateAccommodationInfoForm = (
  data: AccommodationInfoForm
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.bookingdate) {
    errors.bookingdate = "Booking date is required";
  }

  if (!data.traveldate) {
    errors.traveldate = "Travel date is required";
  }

  if (!data.bookingstatus?.trim()) {
    errors.bookingstatus = "Booking status is required";
  }

  if (!data.checkindate) {
    errors.checkindate = "Check-in date is required";
  }

  if (!data.checkintime) {
    errors.checkintime = "Check-in time is required";
  }

  if (!data.checkoutdate) {
    errors.checkoutdate = "Check-out date is required";
  }

  if (!data.checkouttime) {
    errors.checkouttime = "Check-out time is required";
  }

  if (!data.pax) {
    errors.pax = "Number of Pax is required";
  } else if (isNaN(Number(data.pax)) || Number(data.pax) <= 0) {
    errors.pax = "Pax must be a positive number";
  }

  if (!data.mealPlan) {
    errors.mealPlan = "Meal plan is required";
  }

  if (!data.confirmationNumber) {
    errors.confirmationNumber = "Confirmation number is required";
  }

  if (!data.accommodationType) {
    errors.accommodationType = "Accommodation type is required";
  }

  if (!data.propertyName?.trim()) {
    errors.propertyName = "Property name is required";
  }

  if (!data.propertyAddress?.trim()) {
    errors.propertyAddress = "Property address is required";
  }

  if (data.googleMapsLink && !/^https?:\/\/(www\.)?google\.com\/maps/.test(data.googleMapsLink)) {
    errors.googleMapsLink = "Invalid Google Maps link";
  }

  if (!data.costprice) {
    errors.costprice = "Cost price is required";
  } else if (isNaN(Number(data.costprice)) || Number(data.costprice) < 0) {
    errors.costprice = "Cost price must be a valid positive number";
  }

  if (!data.sellingprice) {
    errors.sellingprice = "Selling price is required";
  } else if (isNaN(Number(data.sellingprice)) || Number(data.sellingprice) < 0) {
    errors.sellingprice = "Selling price must be a valid positive number";
  }

  if (data.voucher && !(data.voucher instanceof File)) {
    errors.voucher = "Voucher must be a valid file";
  }

  if (data.taxinvoice && !(data.taxinvoice instanceof File)) {
    errors.taxinvoice = "Tax invoice must be a valid file";
  }

  // remarks is optional, so no strict check

  // date logic check
  if (data.checkindate && data.checkoutdate) {
    const checkIn = new Date(data.checkindate);
    const checkOut = new Date(data.checkoutdate);
    if (checkIn > checkOut) {
      errors.checkoutdate = "Check-out date must be after check-in date";
    }
  }

  return errors;
};



// API Service Class
export class BookingApiService {
  // Get available services
  static async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const response = await apiClient.get('/services');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        success: false,
        message: 'Failed to fetch services',
      };
    }
  }

  // Validate customer
  static async validateCustomer(customerId: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.get(`/customers/validate/${customerId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error validating customer:', error);
      return {
        success: false,
        message: 'Customer validation failed',
      };
    }
  }

  // Validate vendor
  static async validateVendor(vendorId: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.get(`/vendors/validate/${vendorId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error validating vendor:', error);
      return {
        success: false,
        message: 'Vendor validation failed',
      };
    }
  }

  // Create quotation
  static async createQuotation(bookingData: BookingData, draftId?: string): Promise<ApiResponse<unknown>> {
    try {
      // Get user info
      const user = getAuthUser<Record<string, unknown>>() || {};
      const partyId = (user && typeof user === 'object' && '_id' in user ? (user as { _id?: string })._id : '') || '';

      // Prepare payload
      const payload: QuotationPayload = {
        quotationType: bookingData.service.category,
        channel: 'B2C',
        partyId,
        formFields: {
          ...bookingData.generalInfo,
          ...bookingData.serviceInfo,
          ...bookingData.customerform,
           ...bookingData.vendorform,
            ...bookingData.flightinfoform,
          service: bookingData.service,
        },
        totalAmount: bookingData.serviceInfo.budget,
        status: 'confirmed',
      };

      const response = await apiClient.post('/quotation/create-quotation', payload);

      // If quotation is created successfully and we have a draftId, delete the draft
      if (response.data && draftId) {
        DraftManager.completeDraft(draftId, response.data.id || response.data._id, true);
      }

      return {
        success: true,
        data: response.data,
        message: 'Quotation created successfully',
      };
    } catch (error) {
      const err = error as AxiosError<{ message?: string; errors?: Record<string, string> }>;
      console.error('Error creating quotation:', err);

      if (err?.response) {
        return {
          success: false,
          message: err.response.data?.message || 'Failed to create quotation',
          errors: err.response.data?.errors,
        };
      }

      return {
        success: false,
        message: err.message || 'An unexpected error occurred',
      };
    }
  }

  // Save draft booking to localStorage
  static async saveDraft(bookingData: Partial<BookingData>, draftName?: string): Promise<ApiResponse<DraftBooking>> {
    try {
      const draft = DraftManager.saveDraft(bookingData, draftName);
      return {
        success: true,
        data: draft,
        message: 'Draft saved successfully to local storage',
      };
    } catch (error) {
      console.error('Error saving draft:', error);
      return {
        success: false,
        message: 'Failed to save draft',
      };
    }
  }

  // Get booking drafts from localStorage
  static async getDrafts(): Promise<ApiResponse<DraftBooking[]>> {
    try {
      const drafts = DraftManager.getAllDrafts();
      return {
        success: true,
        data: drafts,
        message: `Found ${drafts.length} drafts`,
      };
    } catch (error) {
      console.error('Error fetching drafts:', error);
      return {
        success: false,
        message: 'Failed to fetch drafts',
      };
    }
  }

  // Get draft by ID from localStorage
  static async getDraftById(id: string): Promise<ApiResponse<DraftBooking | null>> {
    try {
      const draft = DraftManager.getDraftById(id);
      return {
        success: true,
        data: draft,
        message: draft ? 'Draft found' : 'Draft not found',
      };
    } catch (error) {
      console.error('Error fetching draft:', error);
      return {
        success: false,
        message: 'Failed to fetch draft',
      };
    }
  }

  // Delete draft from localStorage
  static async deleteDraft(id: string): Promise<ApiResponse<boolean>> {
    try {
      const success = DraftManager.deleteDraft(id);
      return {
        success,
        data: success,
        message: success ? 'Draft deleted successfully' : 'Failed to delete draft',
      };
    } catch (error) {
      console.error('Error deleting draft:', error);
      return {
        success: false,
        message: 'Failed to delete draft',
      };
    }
  }

  // Search drafts in localStorage
  static async searchDrafts(query: string): Promise<ApiResponse<DraftBooking[]>> {
    try {
      const drafts = DraftManager.searchDrafts(query);
      return {
        success: true,
        data: drafts,
        message: `Found ${drafts.length} matching drafts`,
      };
    } catch (error) {
      console.error('Error searching drafts:', error);
      return {
        success: false,
        message: 'Failed to search drafts',
      };
    }
  }

  // Convert draft to quotation (create quotation from draft)
  static async convertDraftToQuotation(draftId: string): Promise<ApiResponse<unknown>> {
    try {
      const draft = DraftManager.getDraftById(draftId);
      if (!draft) {
        return {
          success: false,
          message: 'Draft not found',
        };
      }

      // Convert draft to booking data format
      const bookingData: BookingData = {
        service: draft.service!,
        generalInfo: draft.generalInfo as GeneralInfo,
        serviceInfo: draft.serviceInfo as ServiceInfo,
        customerform: draft.customerform!,
        vendorform: draft.vendorform!,
        flightinfoform: draft.flightinfoform!,
        timestamp: new Date().toISOString(),
      };

      // Create quotation and auto-delete draft
      return await this.createQuotation(bookingData, draftId);
    } catch (error) {
      console.error('Error converting draft to quotation:', error);
      return {
        success: false,
        message: 'Failed to convert draft to quotation',
      };
    }
  }

  // Sync drafts with backend quotations (check if any drafts have been completed)
  static async syncDraftsWithBackend(): Promise<ApiResponse<{ syncedCount: number }>> {
    try {
      const drafts = DraftManager.getAllDrafts();
      let syncedCount = 0;

      // Get user's quotations from backend
      const user = getAuthUser<Record<string, unknown>>() || {};
      const partyId = (user && typeof user === 'object' && '_id' in user ? (user as { _id?: string })._id : '') || '';

      if (partyId) {
        const quotationsResponse = await this.getQuotationsByParty(partyId);

        if (quotationsResponse.success && quotationsResponse.data) {
          const quotations = Array.isArray(quotationsResponse.data) ? quotationsResponse.data as BackendQuotation[] : [];

          // Check each draft against backend quotations
          drafts.forEach(draft => {
            const matchingQuotation = quotations.find((q: BackendQuotation) =>
              q.formFields?.customer === draft.generalInfo?.customer &&
              q.formFields?.destination === draft.serviceInfo?.destination &&
              q.quotationType === draft.service?.category
            );

            if (matchingQuotation) {
              DraftManager.completeDraft(draft.id, matchingQuotation.id || matchingQuotation._id || '', true);
              syncedCount++;
            }
          });
        }
      }

      return {
        success: true,
        data: { syncedCount },
        message: `Synced ${syncedCount} drafts with backend quotations`,
      };
    } catch (error) {
      console.error('Error syncing drafts with backend:', error);
      return {
        success: false,
        message: 'Failed to sync drafts with backend',
      };
    }
  }

  // Upload file (for documents)
  static async uploadFile(file: File, type: 'document' | 'image'): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        message: 'Failed to upload file',
      };
    }
  }

  // Get all quotations (bookings)
  static async getAllQuotations(): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.get('/quotation/get-all-quotations');
      return {
        success: true,
        data: response.data,
        message: 'Quotations retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching quotations:', error);
      return {
        success: false,
        message: 'Failed to fetch quotations',
      };
    }
  }

  // Get quotation by ID
  static async getQuotationById(id: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.get(`/quotation/get-quotation/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Quotation retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching quotation:', error);
      return {
        success: false,
        message: 'Failed to fetch quotation',
      };
    }
  }

  // Get quotations by party ID
  static async getQuotationsByParty(partyId: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.get(`/quotation/get-quotations-by-party/${partyId}`);
      return {
        success: true,
        data: response.data,
        message: 'Party quotations retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching party quotations:', error);
      return {
        success: false,
        message: 'Failed to fetch party quotations',
      };
    }
  }

  // Update quotation
  static async updateQuotation(id: string, updateData: Partial<QuotationPayload>): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.put(`/quotation/update-quotation/${id}`, updateData);
      return {
        success: true,
        data: response.data,
        message: 'Quotation updated successfully',
      };
    } catch (error) {
      console.error('Error updating quotation:', error);
      return {
        success: false,
        message: 'Failed to update quotation',
      };
    }
  }

  // Delete quotation
  static async deleteQuotation(id: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.delete(`/quotation/delete-quotation/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Quotation deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting quotation:', error);
      return {
        success: false,
        message: 'Failed to delete quotation',
      };
    }
  }

  // Get booking history (alias for getAllQuotations with pagination)
  static async getBookingHistory(page = 1, limit = 10): Promise<ApiResponse<unknown>> {
    try {
      const response = await apiClient.get(`/quotation/get-all-quotations?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data,
        message: 'Booking history retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching booking history:', error);
      return {
        success: false,
        message: 'Failed to fetch booking history',
      };
    }
  }
}

export default BookingApiService;
