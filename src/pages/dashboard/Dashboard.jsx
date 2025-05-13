import { Outlet } from "react-router-dom";
import '../../styles/Dashboard.css'
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <section className="main-content">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}