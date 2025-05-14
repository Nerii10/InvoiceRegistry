import { Outlet } from "react-router-dom";
import "../../styles/Dashboard.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    setWindowWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar style={windowWidth <= 700 ? "mobile" : "desktop"} />
      <section className="main-content">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
