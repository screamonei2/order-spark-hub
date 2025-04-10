
export type OrderStatus = "draft" | "pending" | "approved" | "rejected" | "in_progress" | "completed" | "cancelled";
export type PaymentMethod = "cash" | "credit_card" | "bank_transfer" | "pix" | "boleto";

export interface OrderProduct {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  clientId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  category: string;
  sku: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  tradingName?: string;
  legalName?: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  active: boolean;
}
