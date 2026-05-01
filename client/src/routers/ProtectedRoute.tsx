// src/components/ProtectedRoutes.tsx
import { Navigate, Outlet } from "react-router";
import { authService } from "../services/authServices";

interface Props {
  allowedRoles?: Array<"cashier" | "manager" | "customer">;
}

const ProtectedRoutes = ({ allowedRoles }: Props) => {
  const user = authService.getCurrentUser();
  const isAuth = authService.isAuthenticated();

  if (!isAuth || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;