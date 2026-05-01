// import { NavLink } from "react-router";

// const links = [
//     { to: "/", label: "Dashboard", icon: "📊" },
//     { to: "/types", label: "Types", icon: "🏷️" },
//     { to: "/sections", label: "Sections", icon: "📑" },
//     { to: "/filters", label: "Filters", icon: "🔍" },
//     { to: "/menus", label: "Menus", icon: "🍔" },
// ];

// export default function Sidebar() {
//     return (
//         <aside className="sidebar">
//             <div className="sidebar-header">
//                 <span className="sidebar-logo">M</span>
//                 <div>
//                     <div className="sidebar-title">McD Manager</div>
//                     <div className="sidebar-tagline">i'm lovin' it</div>
//                 </div>
//             </div>
//             <nav className="sidebar-nav">
//                 {links.map((l) => (
//                     <NavLink
//                         key={l.to}
//                         to={l.to}
//                         end={l.to === "/"}
//                         className={({ isActive }) =>
//                             "sidebar-link" + (isActive ? " active" : "")
//                         }
//                     >
//                         <span>{l.icon}</span>
//                         <span>{l.label}</span>
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// }