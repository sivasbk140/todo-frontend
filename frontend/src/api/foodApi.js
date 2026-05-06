import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin/food";

export const getFoodItems = () => axios.get(`${BASE_URL}/items`);

export const getFoodItemById = (id) => axios.get(`${BASE_URL}/item/${id}`);

export const createFoodItem = (data) => axios.post(`${BASE_URL}/item`, data);

export const updateFoodItem = (id, data) => axios.put(`${BASE_URL}/item/${id}`, data);

export const deleteFoodItem = (id) => axios.delete(`${BASE_URL}/item/${id}`);

export const getFoodItemsByCategory = (category) =>
  axios.get(`${BASE_URL}/items/category/${category}`);

export const getLowStockItems = (threshold = 10) =>
  axios.get(`${BASE_URL}/items/low-stock`, { params: { threshold } });

export const searchFoodItems = (keyword) =>
  axios.get(`${BASE_URL}/items/search`, { params: { keyword } });
