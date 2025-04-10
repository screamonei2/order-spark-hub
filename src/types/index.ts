// Re-export all types
export * from './client.d';
export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
};

export type PaymentMethod = "cash" | "credit_card" | "bank_transfer" | "pix";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
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
