// src/pages/NavBar.tsx
import { NavLink, Outlet, useNavigate } from "react-router";

const links = [
  { to: "/admin", label: "🏠 Home", end: true },
  { to: "/admin/dashboard", label: "📊 Dashboard" },
  { to: "/admin/menu", label: "🍔 Menu" },
  { to: "/admin/types", label: "🏷️ Types" },        // ← aktif
  { to: "/admin/sections", label: "📑 Sections" },  // ← aktif
  { to: "/admin/filters", label: "🔍 Filters" },
  { to: "/admin/orders", label: "📦 Orders" },
  { to: "/admin/admin-users", label: "👥 Users" },  // ← tambah ini juga
];

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">M</span>
          <div>
            <div className="sidebar-title">McD Manager</div>
            <div className="sidebar-tagline">i'm lovin' it</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ marginTop: 24, width: "100%" }}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}