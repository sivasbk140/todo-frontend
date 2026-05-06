import React from "react";
import { getOrderById } from "../api/orderApi";
import { getAllOrders } from "../api/orderApi";
import { useEffect, useState } from "react";
import { updateOrderStatus } from "./../api/orderApi";
import { cancelOrder } from "./../api/orderApi";
import { getOrdersByStatus } from "../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchOrders = () => {
    getAllOrders()
      .then((res) => {
        console.log("API RESPONSE:", res);
        console.log("DATA:", res.data);
        setOrders(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = () => {
    if (!searchId) return fetchOrders();

    getOrderById(searchId)
      .then((res) => setOrders([res.data]))
      .catch(() => alert("Order not found"));
  };

  const handleView = (orderId) => {
    setShowModal(true);
    setLoadingDetail(true);
    setSelectedOrder(null);
    getOrderById(orderId)
      .then((res) => setSelectedOrder(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load order details");
        setShowModal(false);
      })
      .finally(() => setLoadingDetail(false));
  };

  const handleViewByStatus = async (status) => {
    try {
      if (!status) {
        const res = await getAllOrders();
        setOrders(res.data);
      } else {
        const res = await getOrdersByStatus(status);
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    }
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (!newStatus) return;
    updateOrderStatus(orderId, newStatus)
      .then((res) => {
        const updated = res.data;
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: updated.status } : o,
          ),
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err?.response?.data?.message || "Failed to update order status");
      });
  };

  const handleCancel = (orderId) => {
    if (!window.confirm(`Cancel order #${orderId}?`)) return;
    cancelOrder(orderId)
      .then((res) => {
        const updated = res.data;
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId ? { ...o, status: updated.status } : o,
          ),
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err?.response?.data?.message || "Failed to cancel order");
      });
  };

  const formatDate = (raw) => {
    if (!raw) return "-";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-3">
      <h4 className="fw-bold mb-3"> Order List</h4>
      <div className="d-flex gap-2 mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Enter Order ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <select
          className="form-select"
          value={searchStatus}
          onChange={(e) => {
            setSearchStatus(e.target.value);
            handleViewByStatus(e.target.value);
          }}
          style={{ maxWidth: "250px" }}
        >
          <option value="">All Orders</option>
          <option value="PLACED_ORDER">Placed</option>
          <option value="ORDER_CONFIRMED">Confirmed</option>
          <option value="ORDER_PREPARING">Preparing</option>
          <option value="ASSIGNED_DELIVERY_STAFF">Assigned</option>
          <option value="ORDER_DELIVERED">Delivered</option>
          <option value="ORDER_CANCELLED">Cancelled</option>
        </select>
      </div>

      <table className="table table-border table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Order Status</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.userId}</td>
              <td>{order.status}</td>
              <td>{order.totalPrice}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleView(order.orderId)}
                >
                  <i className="bi bi-eye me-1"></i>View
                </button>
              </td>

              <td className="p-2 flex gap-2">
                <select
                  className="border rounded p-1"
                  onChange={(e) => {
                    handleStatusChange(order.orderId, e.target.value);
                    e.target.value = "";
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Update
                  </option>
                  <option value="ORDER_CONFIRMED">Confirm</option>
                  <option value="ORDER_PREPARING">Prepare</option>
                </select>
              </td>

              <td className="p-2 flex gap-2">
                {" "}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleCancel(order.orderId)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Order Details{" "}
                    {selectedOrder && (
                      <span className="text-muted fw-normal">
                        - #{selectedOrder.orderId}
                      </span>
                    )}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                  ></button>
                </div>

                <div className="modal-body">
                  {loadingDetail && (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {!loadingDetail && selectedOrder && (
                    <>
                      <div className="row g-4">
                        <div className="col-md-4">
                          <div className="text-muted small">Order ID</div>
                          <div className="fw-semibold mb-3">
                            #{selectedOrder.orderId}
                          </div>

                          <div className="text-muted small">Status</div>
                          <div className="mb-3">
                            <span className="badge bg-info-subtle text-info-emphasis text-uppercase">
                              {selectedOrder.status}
                            </span>
                          </div>

                          <div className="text-muted small">Total Price</div>
                          <div className="fw-semibold mb-3">
                            ₹{Number(selectedOrder.totalPrice).toFixed(2)}
                          </div>

                          <div className="text-muted small">Order Date</div>
                          <div className="fw-semibold">
                            {formatDate(selectedOrder.createdOn)}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <h6 className="fw-bold mb-3">Customer Details</h6>
                          <div className="text-muted small">User ID</div>
                          <div className="fw-semibold mb-3">
                            {selectedOrder.userId}
                          </div>

                          <div className="text-muted small">User Name</div>
                          <div className="fw-semibold mb-3">
                            {selectedOrder.userName || "-"}
                          </div>

                          <div className="text-muted small">Phone</div>
                          <div className="fw-semibold">
                            {selectedOrder.deliveryPhone || "-"}
                          </div>
                        </div>

                        <div className="col-md-4">
                          <h6 className="fw-bold mb-3">Delivery Details</h6>
                          <div className="text-muted small">Delivery Name</div>
                          <div className="fw-semibold mb-3">
                            {selectedOrder.deliveryName || "-"}
                          </div>

                          <div className="text-muted small">Delivery Phone</div>
                          <div className="fw-semibold mb-3">
                            {selectedOrder.deliveryPhone || "-"}
                          </div>

                          <div className="text-muted small">
                            Delivery Address
                          </div>
                          <div className="fw-semibold">
                            {selectedOrder.deliveryAddress || "-"}
                          </div>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <h6 className="fw-bold mb-3">Order Items</h6>
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: "5%" }}>#</th>
                              <th>Food Item</th>
                              <th className="text-end">Price</th>
                              <th className="text-center">Quantity</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(selectedOrder.items || []).map((item, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{item.foodItemName}</td>
                                <td className="text-end">
                                  ₹{Number(item.price).toFixed(2)}
                                </td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end">
                                  ₹{Number(item.totalPrice).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="4" className="text-end text-muted">
                                Subtotal
                              </td>
                              <td className="text-end">
                                ₹{Number(selectedOrder.totalPrice).toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="4" className="text-end text-muted">
                                Delivery Charge
                              </td>
                              <td className="text-end">₹0.00</td>
                            </tr>
                            <tr>
                              <td colSpan="4" className="text-end fw-bold fs-6">
                                Total Amount
                              </td>
                              <td className="text-end fw-bold fs-6">
                                ₹{Number(selectedOrder.totalPrice).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => window.print()}
                    disabled={!selectedOrder}
                  >
                    <i className="bi bi-printer me-1"></i> Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={closeModal}
            style={{ zIndex: 1050 }}
          ></div>
        </>
      )}
    </div>
  );
}

export default Orders;
