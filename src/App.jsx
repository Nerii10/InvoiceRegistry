// Frameworks
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import { useEffect, useState } from "react";

// Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/documents/Documents";
import AddDocument from "./pages/dashboard/add-document/add-document";
import User from "./pages/dashboard/user/User";
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";

// Styles
import "./App.css";
import TEST from "./pages/test";
import { AnimatePresence } from "framer-motion";
import Invoice from "./pages/dashboard/documents/Invoice";

export default function App() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      if (location.pathname.startsWith("/auth")) {
        navigate("/dashboard/documents");
      }
    } else {
      if (location.pathname.startsWith("/dashboard")) {
        navigate("/home");
      }
    }
  }, [location, user]);

  return (
    <div className="website" mode="sync">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard isMobile={isMobile} />}>
          <Route index element={<Documents />} />
          <Route path="documents" element={<Documents />} />
          <Route path="invoice/:id" element={<Invoice />} />
          <Route path="add-document" element={<AddDocument />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route path="*" element={<Home isMobile={isMobile} />} />
        <Route path="/test" element={<TEST />} />
      </Routes>
    </div>
  );
}
