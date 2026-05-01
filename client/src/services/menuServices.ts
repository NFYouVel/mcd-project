// src/services/menuServices.ts
import { apiRequest } from "./api";

export interface FilterMenu {
  id: string;
  name: string;
  description?: string;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  price: number;
  isNew: boolean;
  isAvailable: boolean;
  isPackage: boolean;
  imageUrl?: string;
  filterMenuId: string;
  filterMenu?: FilterMenu;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuPayload {
  name: string;
  description?: string;
  price: number;
  isNew: boolean;
  isAvailable: boolean;
  isPackage: boolean;
  imageFile?: File | null; // ← BARU: file upload
  imageUrl?: string;        // ← fallback URL string (kalau ga upload file)
  filterMenuId: string;
}

// Helper: convert payload jadi FormData
const buildFormData = (payload: MenuPayload): FormData => {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("description", payload.description || "");
  fd.append("price", String(payload.price));
  fd.append("isNew", String(payload.isNew));
  fd.append("isAvailable", String(payload.isAvailable));
  fd.append("isPackage", String(payload.isPackage));
  fd.append("filterMenuId", payload.filterMenuId);

  if (payload.imageFile) {
    fd.append("image", payload.imageFile); // field name "image" sesuai upload.single("image")
  } else if (payload.imageUrl) {
    fd.append("imageUrl", payload.imageUrl);
  }

  return fd;
};

export const menuService = {
  getAll: async (): Promise<Menu[]> => {
    const res = await apiRequest("/menus");
    return res.data || res;
  },

  getById: async (id: string): Promise<Menu> => {
    const res = await apiRequest(`/menus/${id}`);
    return res.data || res;
  },

  create: async (payload: MenuPayload) => {
    return apiRequest("/menus", {
      method: "POST",
      body: buildFormData(payload),
      isFormData: true,
    });
  },

  update: async (id: string, payload: MenuPayload) => {
    return apiRequest(`/menus/${id}`, {
      method: "PUT",
      body: buildFormData(payload),
      isFormData: true,
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/menus/${id}`, {
      method: "DELETE",
    });
  },
};

export const filterMenuService = {
  getAll: async (): Promise<FilterMenu[]> => {
    // Sesuaikan endpoint backend lo
    const res = await apiRequest("/filtermenuitem");
    return res.data || res;
  },
};