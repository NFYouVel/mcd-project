import { Routes, Route, Navigate } from "react-router";

// Public pages
import Login from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import ForgetPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UnauthorizedPage from "../pages/UnathorizedPage";

// Layout
import NavBar from "../pages/NavBar";
import EmployeeNavBar from "../pages/EmployeeNavBar";

// Admin pages
import MainMenu from "../pages/MainMenu";
import MenuManagement from "../pages/MenuManagementPage";
import TypeManagement from "../pages/TypeManagementPage";
import SectionManagement from "../pages/SectionManagementPage";
import FilterManagement from "../pages/FilterManagementPage";
import AdminManagementPage from "../pages/AdminManagementPage";
import OrderManagementPage from "../pages/OrderManagementPage";

// Employee (cashier) pages
import EmployeeMenu from "../pages/MainMenuEmployee";
import MakePackage from "../pages/MakePackage";

// Protected route wrapper
import ProtectedRoutes from "./ProtectedRoute";
import MenuCategory from "../pages/MenuCategory";
import ItemPackageChoice from "../pages/ItemPackageChoice";
import ItemCart from "../pages/ItemCart";

// // TODO: aktifkan setelah halaman dibuat
// import OrderManagementPage from "../pages/OrderManagementPage";
// import AdminManagementPage from "../pages/AdminManagementPage";

const Orders = () => <h1>Orders (Coming Soon)</h1>;
import ItemCustomization from "../pages/ItemCustomization"; 

const Router = () => {
  return (
    <Routes>
      {/* ===== Public routes ===== */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ===== Manager only ===== */}
      <Route element={<ProtectedRoutes allowedRoles={["manager"]} />}>
        <Route path="/admin" element={<NavBar />}>
          <Route index element={<MainMenu />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="types" element={<TypeManagement />} />
          <Route path="sections" element={<SectionManagement />} />
          <Route path="filters" element={<FilterManagement />} />
          <Route path="admin-users" element={<AdminManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
        </Route>
      </Route>

      {/* ===== Manager + Cashier (orders) ===== */}
      <Route element={<ProtectedRoutes allowedRoles={["manager", "cashier"]} />}>
        <Route path="/cashier/orders" element={<OrderManagementPage />} />
      </Route>

      {/* ===== Cashier area ===== */}
      <Route element={<ProtectedRoutes allowedRoles={["manager", "cashier"]} />}>
        <Route path="/employee" element={<EmployeeNavBar />}>
          <Route index element={<EmployeeMenu />} />
          <Route path=":id/make-package" element={<MakePackage />} />
          <Route path="category/:sectionId" element={<MenuCategory />} />
          <Route path="category/:sectionId/item/:itemId" element={<ItemPackageChoice />} />
          <Route path="cart" element={<ItemCart />} />
          <Route path="category/:sectionId/customize/:menuId" element={<ItemCustomization />} />
        </Route>
      </Route>

      {/* ===== Fallback ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;