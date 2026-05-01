// src/services/auth.service.ts
import { apiRequest } from "./api";

export interface User {
    id: number;
    email: string;
    name: string;
    role: "manager" | "cashier" | "customer";
}

export const authService = {
    login: async (email: string, password: string) => {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("token");
    },

    forgetPassword: async (email: string) => {
        return apiRequest("/auth/forget-password", {
            method: "POST",
            body: { email },
        });
    },

    resetPassword: async (token: string, newPassword: string) => {
        return apiRequest("/auth/reset-password", {
            method: "POST",
            body: { token, newPassword },
        });
    },
};