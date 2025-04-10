
import { Client, Order, OrderProduct, OrderStatus, PaymentMethod } from "@/types";
import { format, addDays } from "date-fns";
import { mockProducts } from "./mock-data/products";

// Mock Clients
export const mockClients: Client[] = [
  {
    id: "c1",
    name: "Empresa Tech Ltda",
    tradingName: "TechSoft",
    legalName: "Empresa de Tecnologia Tech Ltda",
    taxId: "12.345.678/0001-99",
    email: "contato@techsoft.com",
    phone: "(11) 4321-9876",
    address: "Av. Tecnologia, 123 - São Paulo/SP",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "c2",
    name: "Comércio Local S.A.",
    tradingName: "Mercado Central",
    legalName: "Comércio Local de Alimentos S.A.",
    taxId: "98.765.432/0001-01",
    email: "contato@mercadocentral.com",
    phone: "(11) 1234-5678",
    address: "Rua do Comércio, 456 - São Paulo/SP",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "c3",
    name: "Construções ABC",
    tradingName: "ABC Construtora",
    legalName: "Construções e Reformas ABC Ltda",
    taxId: "45.678.901/0001-23",
    email: "contato@abcconstrucoes.com",
    phone: "(11) 9876-5432",
    address: "Rua da Construção, 789 - São Paulo/SP",
    createdAt: new Date("2023-03-10"),
  },
];

// Helper to create mock order products
const createMockOrderProducts = (): OrderProduct[] => {
  return [
    {
      id: `p${Math.floor(Math.random() * 1000)}`,
      productId: mockProducts[0].id,
      name: mockProducts[0].name,
      quantity: 1,
      unitPrice: mockProducts[0].price,
      totalPrice: mockProducts[0].price,
    },
    {
      id: `p${Math.floor(Math.random() * 1000)}`,
      productId: mockProducts[2].id,
      name: mockProducts[2].name,
      quantity: 12,
      unitPrice: mockProducts[2].price,
      totalPrice: mockProducts[2].price * 12,
    },
  ];
};

// Mock payment methods
const paymentMethods: PaymentMethod[] = ["cash", "credit_card", "bank_transfer", "pix", "boleto"];

// Mock Orders
export const mockOrders: Order[] = mockClients.flatMap((client) =>
  Array.from({ length: 2 }, (_, i) => {
    const products = createMockOrderProducts();
    const totalAmount = products.reduce((sum, product) => sum + product.totalPrice, 0);
    const status: OrderStatus = i % 2 === 0 ? "pending" : "approved";
    const deliveryDate = addDays(new Date(), 7 + i * 3);
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    return {
      id: `o${client.id}${i}`,
      clientId: client.id,
      products,
      deliveryDate,
      status,
      paymentMethod,
      totalAmount,
      notes: i % 2 === 0 ? "Entrega urgente" : "Cliente preferencial",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  })
);

// Service to get client by ID
export const getClientById = (id: string): Client | undefined => {
  return mockClients.find((client) => client.id === id);
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format date
export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

// Map payment method to display text
export const getPaymentMethodText = (method: PaymentMethod): string => {
  const methodMap: Record<PaymentMethod, string> = {
    cash: "Dinheiro",
    credit_card: "Cartão de Crédito",
    bank_transfer: "Transferência Bancária",
    pix: "PIX",
    boleto: "Boleto"
  };
  return methodMap[method];
};

// Map status to display text
export const getStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    draft: "Rascunho",
    pending: "Aguardando Aprovação",
    approved: "Aprovado",
    rejected: "Rejeitado",
    in_progress: "Em Progresso",
    completed: "Concluído",
    cancelled: "Cancelado"
  };
  return statusMap[status];
};

// Map status to color
export const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    draft: "bg-gray-200 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800"
  };
  return colorMap[status];
};

// Export products for direct use
export { mockProducts, getProductById } from "./mock-data/products";
