// Frameworks
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import { useEffect } from "react";

// Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/documents/Documents";
import AddDocument from "./pages/dashboard/add-document/add-document";
import User from "./pages/dashboard/user/User";
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";

// Styles
import "./App.css";

export default function App() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="website">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Documents />} />
          <Route path="documents" element={<Documents />} />
          <Route path="add-document" element={<AddDocument />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
