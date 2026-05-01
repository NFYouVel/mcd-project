// src/services/user.service.ts
import { apiRequest } from "./api";

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: "manager" | "cashier" | "customer";
}

export const userService = {
    getAll: async (): Promise<AdminUser[]> => {
        return apiRequest("/users");
    },

    create: async (payload: {
        name: string;
        email: string;
        password: string;
        role: "manager" | "cashier";
    }) => {
        return apiRequest("/auth/register-admin", {
            method: "POST",
            body: payload,
        });
    },

    update: async (
        id: number,
        payload: {
            name?: string;
            email?: string;
            password?: string;
            role?: "manager" | "cashier";
        }
    ) => {
        return apiRequest(`/users/${id}`, {
            method: "PUT",
            body: payload,
        });
    },

    delete: async (id: number) => {
        return apiRequest(`/users/${id}`, {
            method: "DELETE",
        });
    },
};