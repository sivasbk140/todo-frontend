import api from "./axiosInstance";

export const getAllOrders = () => {
  return api.get("/api/admin/orders");
};

export const getOrderById = (id) => {
  return api.get(`/api/admin/orders/${id}`);
};

export const getCompletedOrders = () => {
  return api.get("/api/admin/orders/completed");
};

export const getCancelledOrders = () => {
  return api.get("/api/admin/orders/cancelled");
};

export const getOrdersByStatus = (status) => {
  return api.get(`/api/admin/orders/status/${status}`);
};

export const getOrdersByUser = (userId) => {
  return api.get(`/api/admin/orders/user/${userId}`);
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`/api/admin/orders/${id}/status?status=${status}`);
};

export const assignDeliveryStaff = (id, staffId) => {
  return api.patch(`/api/admin/orders/${id}/assign?staffId=${staffId}`);
};

export const cancelOrder = (id) => {
  return api.patch(`/api/admin/orders/${id}/cancel`);
};
