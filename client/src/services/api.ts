const BASE_URL = "http://localhost:5000/api";

// ====================== HELPERS ======================
async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed");
    }
    return data.data as T;
}

// ====================== TYPE REQUESTS ======================
export async function getTypesRequest() {
    const response = await fetch(`${BASE_URL}/type`);
    return handleResponse<any[]>(response);
}

export async function createTypeRequest(foodTypeId: number, description: string) {
    const response = await fetch(`${BASE_URL}/type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodTypeId, description }),
    });
    return handleResponse<any>(response);
}

export async function updateTypeRequest(id: string, foodTypeId: number, description: string) {
    const response = await fetch(`${BASE_URL}/type/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodTypeId, description }),
    });
    return handleResponse<any>(response);
}

export async function deleteTypeRequest(id: string) {
    const response = await fetch(`${BASE_URL}/type/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete type failed");
}

// ====================== SECTION REQUESTS ======================
export async function getSectionsRequest() {
    const response = await fetch(`${BASE_URL}/menusection`);
    return handleResponse<any[]>(response);
}

export async function createSectionRequest(name: string, description: string, typeId: string) {
    const response = await fetch(`${BASE_URL}/menusection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, typeId }),
    });
    return handleResponse<any>(response);
}

export async function updateSectionRequest(id: string, name: string, description: string, typeId: string) {
    const response = await fetch(`${BASE_URL}/menusection/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, typeId }),
    });
    return handleResponse<any>(response);
}

export async function deleteSectionRequest(id: string) {
    const response = await fetch(`${BASE_URL}/menusection/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete section failed");
}

// ====================== FILTER REQUESTS ======================
export async function getFiltersRequest() {
    const response = await fetch(`${BASE_URL}/filtermenu`);
    return handleResponse<any[]>(response);
}

export async function createFilterRequest(name: string, description: string, sectionMenuId: string) {
    const response = await fetch(`${BASE_URL}/filtermenu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, sectionMenuId }),
    });
    return handleResponse<any>(response);
}

export async function updateFilterRequest(id: string, name: string, description: string, sectionMenuId: string) {
    const response = await fetch(`${BASE_URL}/filtermenu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, sectionMenuId }),
    });
    return handleResponse<any>(response);
}

export async function deleteFilterRequest(id: string) {
    const response = await fetch(`${BASE_URL}/filtermenu/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete filter failed");
}

// ====================== MENU REQUESTS ======================
export async function getMenusRequest(search?: string, filterMenuId?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterMenuId) params.set("filterMenuId", filterMenuId);
    const qs = params.toString();

    const response = await fetch(`${BASE_URL}/menu${qs ? "?" + qs : ""}`);
    return handleResponse<any[]>(response);
}

export async function createMenuRequest(formData: FormData) {
    const response = await fetch(`${BASE_URL}/menu`, {
        method: "POST",
        body: formData,
    });
    return handleResponse<any>(response);
}

export async function updateMenuRequest(id: string, formData: FormData) {
    const response = await fetch(`${BASE_URL}/menu/${id}`, {
        method: "PUT",
        body: formData,
    });
    return handleResponse<any>(response);
}

export async function toggleMenuRequest(id: string) {
    const response = await fetch(`${BASE_URL}/menu/${id}/toggle`, { method: "PATCH" });
    return handleResponse<any>(response);
}

export async function deleteMenuRequest(id: string) {
    const response = await fetch(`${BASE_URL}/menu/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete menu failed");
}