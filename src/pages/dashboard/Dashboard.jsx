import { Outlet } from "react-router-dom";
import "../../styles/Dashboard.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Dashboard({ isMobile }) {
  return (
    <div className="dashboard-layout">
      <Sidebar style={isMobile ? "mobile" : "desktop"} />
      <section className="main-content">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
