import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TypeManagement from "./pages/TypeManagement";
import SectionManagement from "./pages/SectionManagement";
import FilterManagement from "./pages/FilterManagement";
import MenuManagement from "./pages/MenuManagement";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/types" element={<TypeManagement />} />
            <Route path="/sections" element={<SectionManagement />} />
            <Route path="/filters" element={<FilterManagement />} />
            <Route path="/menus" element={<MenuManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}