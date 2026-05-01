// src/services/categoryServices.ts
import { apiRequest } from "./api";

// ============ TYPES ============
export interface Type {
    id: string;
    foodTypeId: number;
    description: "heavy" | "light" | "promotion" | "drinks" | "dessert" | "rice";
    createdAt?: string;
    updatedAt?: string;
}

export interface FilterMenu {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SectionMenu {
    id: string;
    name: string;
    description?: string;
    typeId: string;              // ← lowercase, mapped to "Type" column
    type?: Type;                 // ← lowercase 't' (sesuai @BelongsTo declare type)
    filterMenus?: FilterMenu[];  // ← lowercase 'f' (sesuai @BelongsToMany declare filterMenus)
    createdAt?: string;
    updatedAt?: string;
}

const unwrap = (res: any) => {
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res;
};

// ============ TYPE SERVICE ============
export const typeService = {
    getAll: async (): Promise<Type[]> => {
        const res = await apiRequest("/type");
        return unwrap(res) || [];
    },

    update: async (id: string, payload: Partial<Type>) => {
        return apiRequest(`/type/${id}`, {
            method: "PUT",
            body: payload,
        });
    },
};

// ============ FILTER SERVICE ============
export const filterService = {
    getAll: async (): Promise<FilterMenu[]> => {
        const res = await apiRequest("/filtermenu");
        return unwrap(res) || [];
    },

    create: async (payload: { name: string; description?: string }) => {
        return apiRequest("/filtermenu", {
            method: "POST",
            body: payload,
        });
    },

    update: async (id: string, payload: { name?: string; description?: string }) => {
        return apiRequest(`/filtermenu/${id}`, {
            method: "PUT",
            body: payload,
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/filtermenu/${id}`, {
            method: "DELETE",
        });
    },
};

// ============ SECTION SERVICE ============
export const sectionService = {
    getAll: async (): Promise<SectionMenu[]> => {
        const res = await apiRequest("/menusection");
        return unwrap(res) || [];
    },

    getById: async (id: string): Promise<SectionMenu> => {
        const res = await apiRequest(`/menusection/${id}`);
        return unwrap(res);
    },

    create: async (payload: {
        name: string;
        description?: string;
        typeId: string;
        filterIds?: string[];
    }) => {
        return apiRequest("/menusection", {
            method: "POST",
            body: payload,
        });
    },

    update: async (
        id: string,
        payload: {
            name?: string;
            description?: string;
            typeId?: string;
            filterIds?: string[];
        }
    ) => {
        return apiRequest(`/menusection/${id}`, {
            method: "PUT",
            body: payload,
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/menusection/${id}`, {
            method: "DELETE",
        });
    },
};