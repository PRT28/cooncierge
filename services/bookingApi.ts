"use client";

import axios, { AxiosResponse, AxiosError } from 'axios';

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
  timestamp: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

interface QuotationPayload {
  quotationType: string;
  channel: 'B2C' | 'B2B';
  partyId: string;
  formFields: Record<string, any>;
  totalAmount: number;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.authorization = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
  static async validateCustomer(customerId: string): Promise<ApiResponse<any>> {
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
  static async validateVendor(vendorId: string): Promise<ApiResponse<any>> {
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
  static async createQuotation(bookingData: BookingData): Promise<ApiResponse<any>> {
    try {
      // Get user info
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : {};
      const partyId = user._id || '';

      // Prepare payload
      const payload: QuotationPayload = {
        quotationType: bookingData.service.category,
        channel: 'B2C',
        partyId,
        formFields: {
          ...bookingData.generalInfo,
          ...bookingData.serviceInfo,
          service: bookingData.service,
        },
        totalAmount: bookingData.serviceInfo.budget,
        status: 'draft',
      };

      const response = await apiClient.post('/quotation/create-quotation', payload);
      
      return {
        success: true,
        data: response.data,
        message: 'Quotation created successfully',
      };
    } catch (error) {
      console.error('Error creating quotation:', error);
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to create quotation',
          errors: error.response?.data?.errors,
        };
      }
      
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  // Save draft booking
  static async saveDraft(bookingData: Partial<BookingData>): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/bookings/draft', bookingData);
      return {
        success: true,
        data: response.data,
        message: 'Draft saved successfully',
      };
    } catch (error) {
      console.error('Error saving draft:', error);
      return {
        success: false,
        message: 'Failed to save draft',
      };
    }
  }

  // Get booking drafts
  static async getDrafts(): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiClient.get('/bookings/drafts');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching drafts:', error);
      return {
        success: false,
        message: 'Failed to fetch drafts',
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

  // Get booking history
  static async getBookingHistory(page = 1, limit = 10): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`/bookings/history?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data,
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
