import apiClient from "@/services/apiClient"; 

export const createVendor = async (customerData: any) => {
  try {
    const response = await apiClient.post("/create-vendor", customerData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create customer:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getVendors = async () => {
  try {
    const response = await apiClient.get("/get-all-vendors");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch customers:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
