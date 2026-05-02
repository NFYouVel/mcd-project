// src/services/user.service.ts
import { apiRequest } from "./api";

export type UserRole = "manager" | "cashier" | "customer";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    address?: string | null;
    birth_of_date?: string | null;
    salary?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserCreatePayload {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    address?: string | null;          // ← tambah | null
    birth_of_date?: string | null;    // ← tambah | null
    salary?: number | null;            // ← tambah | null
}

export interface UserUpdatePayload {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    address?: string | null;
    birth_of_date?: string | null;
    salary?: number | null;
}

export const userService = {
    getAll: async (): Promise<AdminUser[]> => {
        const res = await apiRequest("/user");
        // Handle wrapped/unwrapped response
        return res.data || res;
    },

    getById: async (id: string): Promise<AdminUser> => {
        const res = await apiRequest(`/user/${id}`);
        return res.data || res;
    },

    create: async (payload: UserCreatePayload) => {
        return apiRequest("/user", {
            method: "POST",
            body: payload,
        });
    },

    update: async (id: string, payload: UserUpdatePayload) => {
        return apiRequest(`/user/${id}`, {
            method: "PUT",
            body: payload,
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/user/${id}`, {
            method: "DELETE",
        });
    },
};