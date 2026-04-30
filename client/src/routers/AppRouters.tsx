import { Routes, Route, Navigate } from "react-router";
import Login from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import NavBar from "../pages/NavBar";
import MainMenu from "../pages/MainMenu";

// Management pages
import Dashboard from "../pages/Dashboard";
import MenuManagement from "../pages/MenuManagementPage";
import TypeManagement from "../pages/TypeManagementPage";
import SectionManagement from "../pages/SectionManagementPage";
import FilterManagement from "../pages/FilterManagementPage";

// Employee pages
import EmployeeMenu from "../pages/MainMenuEmployee";
import EmployeeNavBar from "../pages/EmployeeNavBar";
import MakePackage from "../pages/MakePackage";

const Orders = () => <h1>Orders (Coming Soon)</h1>;

const Router = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected layout (NavBar wrapper) */}
      <Route path="/menu" element={<NavBar />}>
        <Route index element={<MainMenu />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Menu Management = Products */}
        <Route path="products" element={<MenuManagement />} />

        {/* Order */}
        <Route path="orders" element={<Orders />} />

        {/* Promosi → group of Type/Section/Filter management */}
        <Route path="types" element={<TypeManagement />} />
        <Route path="sections" element={<SectionManagement />} />
        <Route path="filters" element={<FilterManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/employee" element={<EmployeeNavBar />}>
        <Route index element={<EmployeeMenu />} />

        {/* make package flow */}
        <Route path=":id/make-package" element={<MakePackage />} />


        {/* normal menu detail page (YOU NEED THIS) */}
        <Route path=":id" element={<div>Menu Detail</div>} />
        
      </Route>
    </Routes>

  );
};

export default Router;