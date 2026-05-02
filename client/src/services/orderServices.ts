import { apiRequest } from "./api";

export interface MenuMini {
  id: string;
  name: string;
  price: number;
}

export interface VariantItemMini {
  id: string;
  name: string;
  priceModifier: number;
}

export interface OrderItem {
  id: string;
  status: string;
  menuId: string;
  orderId: string;
  variantItemsId?: string | null;
  createdAt: string;
  updatedAt: string;
  menu: MenuMini;
  variantItems?: VariantItemMini | null;  // ← pastikan ada
  ingredientItems: any[];
}

export interface Order {
  id: string;
  status: 'pending' | 'checkedout' | 'served' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

// Helper: hitung total order dari items
export const calculateOrderTotal = (order: Order): number => {
  if (!order.orderItems) return 0;

  return order.orderItems.reduce((sum, item) => {
    // 1. Harga menu utama
    const menuPrice = item.menu?.price || 0;

    // 2. Variant price modifier (bisa +, -, atau 0)
    const variantPrice = item.variantItems?.priceModifier || 0;  // ← TAMBAH INI

    // 3. Hitung extras dari ingredientItems (cuma yang qty > 1)
    const extrasPrice = (item.ingredientItems || []).reduce((extraSum, ing) => {
      if (ing.quantity > 1) {
        const extraQty = ing.quantity - 1;
        return extraSum + (extraQty * (ing.price || 0));
      }
      return extraSum;
    }, 0);

    return sum + menuPrice + variantPrice + extrasPrice;  // ← include variantPrice
  }, 0);
};

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const res = await apiRequest("/orders");
    return res.data || [];
  },

  getById: async (id: string): Promise<Order> => {
    const res = await apiRequest(`/orders/${id}`);
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/orders/${id}`, {
      method: "PUT",
      body: { status },
    });
  },

  updateItemStatus: async (orderItemId: string, status: string) => {
    return apiRequest(`/order-items/${orderItemId}`, {
      method: "PUT",
      body: { status },
    });
  },
};