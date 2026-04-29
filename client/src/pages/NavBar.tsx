import { NavLink, Outlet, useNavigate } from "react-router";

const links = [
  { to: "/menu", label: "🏠 Home", end: true },
  { to: "/menu/dashboard", label: "📊 Dashboard" },
  { to: "/menu/products", label: "🍔 Menu" },
  { to: "/menu/types", label: "🏷️ Types" },
  { to: "/menu/sections", label: "📑 Sections" },
  { to: "/menu/filters", label: "🔍 Filters" },
  { to: "/menu/orders", label: "📦 Orders" },
];

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // kalo nanti pake auth
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