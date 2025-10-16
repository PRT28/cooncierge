import apiClient from "@/services/apiClient"; 

export const createCustomer = async (customerData: any) => {
  try {
    const response = await apiClient.post("/customer/create-customer", customerData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create customer:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getCustomers = async () => {
  try {
    const response = await apiClient.get("/customer/get-all-customers");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch customers:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};
