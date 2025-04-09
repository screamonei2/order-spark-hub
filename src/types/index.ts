
export interface Client {
  id: string;
  name: string;
  tradingName: string;
  legalName: string;
  taxId: string; // CNPJ
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku?: string;
  stock?: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  clientId: string;
  products: OrderProduct[];
  deliveryDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderProduct {
  id: string;
  productId?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'pix';
