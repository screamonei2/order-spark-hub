
import { Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Design de Website",
    description: "Criação completa de site responsivo com até 5 páginas",
    price: 3500,
    category: "Design",
    sku: "DSN-WEB-001",
    stock: 999,
    costPrice: 2000,
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "p2",
    name: "Desenvolvimento de App",
    description: "Aplicativo móvel para Android e iOS",
    price: 12000,
    category: "Desenvolvimento",
    sku: "DEV-APP-001",
    stock: 999,
    costPrice: 6000,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "p3",
    name: "Manutenção Mensal",
    description: "Suporte técnico e atualizações mensais",
    price: 750,
    category: "Serviços",
    sku: "SRV-MNT-001",
    stock: 999,
    costPrice: 350,
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    id: "p4",
    name: "Hospedagem Premium",
    description: "Hospedagem de site com alto desempenho",
    price: 120,
    category: "Infraestrutura",
    sku: "INF-HSP-001",
    stock: 999,
    costPrice: 50,
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-01-25"),
  },
  {
    id: "p5",
    name: "Campanha de Marketing",
    description: "Gestão de anúncios e redes sociais por 30 dias",
    price: 2200,
    category: "Marketing",
    sku: "MKT-CMP-001",
    stock: 999,
    costPrice: 1200,
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
  }
];

// Function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};
