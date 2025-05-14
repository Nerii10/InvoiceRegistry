import "../../styles/Sidebar.css";
import { File, Upload, UserCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
export default function Sidebar({ style }) {
  
  const location = useLocation();
  const [currentPath, setcurrentPath] = useState("documents");
  const [windowOpen, setWindowOpen] = useState(false);

  useEffect(() => {
    // console.log(location.pathname.split('/')[2])
    setcurrentPath(location.pathname.split("/")[2]);
  }, [location]);

  return (
    <>
      {style == "mobile" && (
        <button
          className="sidebar-mobile-button"
          onClick={() => {
            setWindowOpen((o) => !o);
          }}
        >
          {windowOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      )}
      <aside
        className={
          style == "desktop"
            ? "sidebar"
            : style == "mobile" && windowOpen
            ? "sidebar-mobile-open"
            : "sidebar-mobile-closed"
        }
      >
        <section className="sidebar-header">
          <h1>Dashboard</h1>
        </section>

        <nav className="sidebar-navigation">
          <Link
            to={"/dashboard/documents"}
            className={
              currentPath == "documents"
                ? "sidebar-input-active"
                : "sidebar-input"
            }
          >
            <File stroke="white" />
            Documents
          </Link>

          <Link
            to={"/dashboard/add-document"}
            className={
              currentPath == "add-document"
                ? "sidebar-input-active"
                : "sidebar-input"
            }
          >
            <Upload stroke="white" />
            New
          </Link>

          <Link
            to={"/dashboard/user"}
            className={
              currentPath == "user" ? "sidebar-input-active" : "sidebar-input"
            }
          >
            <UserCircle stroke="white" />
            User
          </Link>

          <Link
            to={"/dashboard/settings"}
            className={
              currentPath == "settings"
                ? "sidebar-input-active"
                : "sidebar-input"
            }
          >
            <Settings stroke="white" />
            Settings
          </Link>
        </nav>

        <section className="sidebar-footer">
          <a href="https://nerii.pl" target="_blank" rel="noopener noreferrer">
            &copy; 2025 nerii
          </a>
        </section>
      </aside>
    </>
  );
}
