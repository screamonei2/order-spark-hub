
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { mockClients, formatDate } from "@/lib/mock-data";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientDetailsProps {
  clientId: string;
  onClose: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ clientId, onClose }) => {
  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="p-4">
        <p>Cliente não encontrado.</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Fechar
        </Button>
      </div>
    );
  }

  // Format the address object into a string
  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    
    try {
      return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}, ${address.neighborhood}, ${address.city}/${address.state}, ${address.zipCode}`;
    } catch (e) {
      return "Endereço indisponível";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="mb-6">
        <SheetTitle className="flex items-center justify-between">
          <span>Detalhes do Cliente</span>
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 overflow-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{client.name}</h3>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/clients/${client.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome Fantasia</p>
                <p className="font-medium">{client.tradingName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Razão Social</p>
                <p className="font-medium">{client.legalName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-medium">{client.taxId}</p>
              </div>
              {client.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              )}
              {client.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <p className="font-medium">{formatDate(client.createdAt)}</p>
              </div>
            </div>
            {client.address && (
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{formatAddress(client.address)}</p>
              </div>
            )}
            {client.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="font-medium">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetails;
