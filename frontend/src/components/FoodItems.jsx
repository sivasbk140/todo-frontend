import { useEffect, useState } from "react";
import {
  createFoodItem,
  deleteFoodItem,
  getFoodItems,
  updateFoodItem,
  searchFoodItems,
} from "../api/foodApi";
import { getFoodItemById } from "../api/foodApi";

const CATEGORY_OPTIONS = ["Veg", "Non-Veg", "BEVERAGE", "DESSERT"];

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  description: "",
  available: "Yes",
};

export default function FoodItems() {
  const [items, setItems] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getFoodItems()
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);
  const fetchItems = () => {
    getFoodItems()
      .then((res) => {
        console.log("API RESPONSE:", res);
        console.log("DATA:", res.data);
        setItems(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = () => {
    if (!searchId) return fetchItems();

    getFoodItemById(searchId)
      .then((res) => setItems([res.data]))
      .catch(() => alert("Food item not found"));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  };

  const handleSearchItemByName = (keyword) => {
    if (!keyword) return fetchItems();

    searchFoodItems(keyword)
      .then((res) => {
        const filtered = res.data.filter((item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()),
        );
        setItems(filtered);
      })
      .catch((err) => console.error(err));
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      category: item.category ?? "",
      price: item.price ?? "",
      quantity: item.quantity ?? "",
      description: item.description ?? "",
      available: item.available ? "Yes" : "No",
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.category) next.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0)
      next.price = "Enter a valid price";
    if (form.quantity === "" || Number(form.quantity) < 0)
      next.quantity = "Enter a valid quantity";
    if (!form.description.trim()) next.description = "Description is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      description: form.description.trim(),
    };

    setSubmitting(true);

    const request = editingId
      ? updateFoodItem(editingId, payload)
      : createFoodItem(payload);

    request
      .then((res) => {
        const saved = res.data;
        setItems((prev) =>
          editingId
            ? prev.map((it) => (it.id === editingId ? saved : it))
            : [...prev, saved],
        );
        closeModal();
      })
      .catch((err) => {
        console.error(err);
        alert(
          editingId
            ? "Failed to update food item"
            : "Failed to create food item",
        );
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeletingId(item.id);
    deleteFoodItem(item.id)
      .then(() => {
        setItems((prev) => prev.filter((it) => it.id !== item.id));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete food item");
      })
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Food Items</h4>
          <small className="text-muted">Manage your menu items here.</small>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-plus-lg me-1"></i> Add Item
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Enter Food Item ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Food Item Name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearchItemByName(keyword)}
        >
          Search
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.description}</td>
              <td>
                <span
                  className={`badge ${item.available ? "bg-success" : "bg-danger"}`}
                >
                  {item.available ? "Yes" : "No"}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openEditModal(item)}
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                        ></span>
                        Deleting
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-1"></i> Delete
                      </>
                    )}
                  </button>
                </div>
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
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-4">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold">
                      {editingId ? "Edit Food Item" : "Add Food Item"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeModal}
                    ></button>
                  </div>

                  <div className="modal-body pt-2">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          placeholder="Enter food name"
                          value={form.name}
                          onChange={handleChange("name")}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.category ? "is-invalid" : ""}`}
                          value={form.category}
                          onChange={handleChange("category")}
                        >
                          <option value="">Select category</option>
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <div className="invalid-feedback">
                            {errors.category}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Price (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`form-control ${errors.price ? "is-invalid" : ""}`}
                          placeholder="Enter price"
                          value={form.price}
                          onChange={handleChange("price")}
                        />
                        {errors.price && (
                          <div className="invalid-feedback">{errors.price}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Quantity <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                          placeholder="Enter quantity"
                          value={form.quantity}
                          onChange={handleChange("quantity")}
                        />
                        {errors.quantity && (
                          <div className="invalid-feedback">
                            {errors.quantity}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          rows="3"
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                          placeholder="Enter description"
                          value={form.description}
                          onChange={handleChange("description")}
                        ></textarea>
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          Available <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={form.available}
                          onChange={handleChange("available")}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <small className="text-muted">
                          Availability is derived from quantity by the server.
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0 pt-0">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={closeModal}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Saving...
                        </>
                      ) : editingId ? (
                        "Save Changes"
                      ) : (
                        "Add Item"
                      )}
                    </button>
                  </div>
                </form>
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
