import { useEffect, useState } from "react";
import { getAllUsers, getUserById } from "../api/userApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    getAllUsers()
      .then((res) => {
        console.log("API RESPONSE:", res);
        console.log("DATA:", res.data);
        setUsers(res.data);
      })
      .catch((err) => console.error(err));
  };
  const handleSearch = () => {
    if (!searchId) return fetchUsers();

    getUserById(searchId)
      .then((res) => setUsers([res.data])) // single user → array
      .catch(() => alert("User not found"));
  };

  return (
    <div className="p-3">
      <h4 className="fw-bold mb-3">Users</h4>

      {/* 🔍 Filter */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Enter User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={fetchUsers}>
          Reset
        </button>
      </div>

      {/* 📋 Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
