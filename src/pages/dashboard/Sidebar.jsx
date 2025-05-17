import "../../styles/Sidebar.css";
import {
  File,
  Upload,
  UserCircle,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    to: "/dashboard/documents",
    icon: File,
    label: "Documents",
    path: "documents",
  },
  {
    to: "/dashboard/add-document",
    icon: Upload,
    label: "New",
    path: "add-document",
  },
  { to: "/dashboard/user", icon: UserCircle, label: "User", path: "user" },
  { to: "/dashboard/settings", icon: Home, label: "Home", path: "settings" },
];

export default function Sidebar({ style = "desktop" }) {
  const { pathname } = useLocation();
  const [currentPath, setCurrentPath] = useState(() =>
    getPathFromUrl(pathname)
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(getPathFromUrl(pathname));
    setIsOpen(false);
  }, [pathname]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Wyrenderuj listę linków
  const links = useMemo(
    () =>
      SIDEBAR_ITEMS.map(({ to, icon: Icon, label, path }) => (
        <Link
          key={path}
          to={to}
          className={`sidebar-input${currentPath === path ? "-active" : ""}`}
        >
          <Icon stroke="white" />
          <span>{label}</span>
        </Link>
      )),
    [currentPath]
  );

  const sidebarClass = useMemo(() => {
    if (style === "desktop") return "sidebar";
    return isOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed";
  }, [style, isOpen]);

  return (
    <>
      {style === "mobile" && (
        <button
          className="sidebar-mobile-button"
          onClick={toggleOpen}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      )}
      <aside className={sidebarClass}>
        <header className="sidebar-header">
          <h3 className="sidebar-title">Dashboard</h3>
        </header>

        <nav className="sidebar-navigation">{links}</nav>

        <footer className="sidebar-footer">
          <a
            href="https://nerii.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-footer-link"
          >
            &copy; 2025 nerii
          </a>
        </footer>
      </aside>
    </>
  );
}

// Pomocnicza funkcja wydobywająca segment ścieżki
function getPathFromUrl(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[1] || "documents";
}
