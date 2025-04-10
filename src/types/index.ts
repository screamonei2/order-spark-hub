
export interface Client {
  id: string;
  name: string;
  tradingName: string;
  legalName: string;
  taxId: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  costPrice?: number;
  sku?: string;
  stock?: number;
  createdAt: Date;
}

export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = "pending" | "approved" | "in_progress" | "completed" | "cancelled";
export type PaymentMethod = "credit_card" | "bank_transfer" | "cash" | "pix" | "boleto";

export interface Order {
  id: string;
  clientId: string;
  products: OrderProduct[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  deliveryDate: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: "sales" | "inventory" | "clients";
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any; // This will depend on the report type
  createdAt: Date;
}

export interface ApprovalRequest {
  id: string;
  orderId: string;
  requestedBy: string;
  requestedAt: Date;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
}
