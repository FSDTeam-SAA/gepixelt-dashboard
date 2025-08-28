import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = (session as any)?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard API
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Meals API
export const getMeals = async (page = 1, limit = 10, day?: string) => {
  let url = `/admin/meals?page=${page}&limit=${limit}`;
  if (day) {
    const capitalizedDay =
      day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    url += `&day=${capitalizedDay}`;
  }
  const response = await api.get(url);
  console.log("[v0] API response for getMeals:", response.data);
  return response.data;
};

export const deleteMeal = async (mealId: string) => {
  const response = await api.delete(`/admin/meals/${mealId}`);
  return response.data;
};

export const createMeal = async (data: FormData) => {
  const response = await api.post("/admin/meals", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateMeal = async (mealId: string, data: FormData) => {
  const response = await api.put(`/admin/meals/${mealId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Orders API
export const getOrders = async (
  page = 1,
  limit = 10,
  filter?: string,
  status?: string
) => {
  let url = `/admin/orders?page=${page}&limit=${limit}`;
  if (filter) url += `&filter=${filter}`;
  if (status) url += `&status=${status}`;
  const response = await api.get(url);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

// Locations API
export const getLocations = async (page = 1, limit = 10) => {
  const response = await api.get(
    `/admin/locations?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const createLocation = async (data: {
  name: string;
  address: string;
}) => {
  const response = await api.post("/admin/locations", data);
  return response.data;
};

export const updateLocation = async (locationId: string, data: any) => {
  const response = await api.put(`/admin/locations/${locationId}`, data);
  return response.data;
};

export const deleteLocation = async (locationId: string) => {
  const response = await api.delete(`/admin/locations/${locationId}`);
  return response.data;
};

export const updateLocationStatus = async (locationId: string, isActive: boolean) => {
  const response = await api.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/locations/${locationId}`,
    { isActive }
  )
  return response.data
}

// Users API
export const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUser = async (userId: string) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Profile API
export const updateProfile = async (data: FormData) => {
  const response = await api.put("/admin/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/admin/change-password", data);
  return response.data;
};

// Auth API
export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const response = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

export default api;
