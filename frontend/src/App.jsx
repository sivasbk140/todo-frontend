import { Routes, Route } from "react-router-dom";
import FoodItems from "./components/FoodItems";
import Sidebar from "./components/SideBar";
import NavBar from "./components/NavBar";
import Users from "./components/Users";
import Orders from "./components/Orders";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
export default function App() {
  return (
    <>
      <div className="bg-body-tertiary d-flex vh-100 fw-bold ">
        {/* Sidebar */}
        <div className="bg-body" style={{ width: "250px" }}>
          <Sidebar />
        </div>

        <div className="postion absolute top 0 w-100">
          <NavBar />
          <div className="align-items-center">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/food-items" element={<FoodItems />} />
              <Route path="/users" element={<Users />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
