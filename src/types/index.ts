
// Re-export all types
export * from './client.d';
export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
};

export type OrderStatus = "draft" | "pending" | "approved" | "rejected" | "in_progress" | "completed" | "cancelled";

export type PaymentMethod = "cash" | "credit_card" | "bank_transfer" | "pix" | "boleto";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  costPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderProduct {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  clientId: string;
  products: OrderProduct[];
  totalAmount: number;
  deliveryDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
