import api from "./axiosInstance";

export const getAllUsers = () => {
  return api.get("/api/Admin");
};

export const getUserById = (id) => {
  return api.get(`/api/Admin/${id}`);
};
