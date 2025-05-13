import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/UserContext.css";
const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        const decoded = jwtDecode(stored);
        setToken(stored);
        setUser(decoded);
        //Debug
        // console.log({token:stored, user:decoded})
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const register = async (credentials) => {
    try {
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setAuthMessage({ message: "Rejestracja udana!", type: "success" });
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        const data = await response.json();
        setAuthMessage({
          message: data.error || "Wystąpił błąd podczas rejestracji.",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      setAuthMessage({
        message: "Wystąpił błąd podczas łączenia z serwerem.",
        type: "error",
      });
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setAuthMessage({ message: "Succesfully logged in..", type: "login" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setAuthMessage({
          message: data.error || "Wystąpił błąd podczas logowania.",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      setAuthMessage({
        message: "Wystąpił błąd podczas łączenia z serwerem.",
        type: "error",
      });
    }
  };

  async function loginGoogle(GoogleToken) {
    try {
      const response = await fetch(`${API_URL}/login/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GoogleToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setAuthMessage({ message: "Succesfully logged in..", type: "login" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setAuthMessage({
          message: data.error || "Wystąpił błąd podczas logowania.",
          type: "error",
        });
      }
    } catch (err) {
      console.log(err);
      setAuthMessage({
        message: "Wystąpił błąd podczas łączenia z serwerem.",
        type: "error",
      });
    }
  }

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        authMessage,
        API_URL,
        register,
        login,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function UserStatus({ user }) {
  const { logout } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar-user">
        <div
          onClick={() => {
            user ? logout() : navigate("/signin");
          }}
          className="navbar-user-data"
        >
          {user?.profilepic && (
            <img
              className="navbar-user-profile-picture"
              src={user?.profilepic}
            ></img>
          )}
          {user && <p style={{ pointerEvents: "none" }}>{user?.username}</p>}

          {user ? (
            <button className="navbar-button">
              <LogOut className="navbar-button-icon" size={15} />
            </button>
          ) : (
            <button className="navbar-button">
              <LogIn className="navbar-button-icon" size={15} /> Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}
