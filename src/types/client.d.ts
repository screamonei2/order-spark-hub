
export interface Client {
  id: string;
  name: string;
  legalName: string;
  tradingName: string;
  taxId: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
