
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NewClientModal from "@/components/clients/NewClientModal";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ClientDetails from "@/components/clients/ClientDetails";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.taxId.includes(searchTerm)
  );

  const handleViewDetails = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie todos os clientes cadastrados no sistema.
            </p>
          </div>
          <Button onClick={() => setIsNewClientModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetails(client.id)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div>{client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.tradingName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.taxId}</TableCell>
                  <TableCell>
                    {client.email && (
                      <div className="text-sm">{client.email}</div>
                    )}
                    {client.phone && (
                      <div className="text-sm">{client.phone}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Excluir cliente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* New Client Modal */}
      <NewClientModal 
        open={isNewClientModalOpen} 
        onOpenChange={setIsNewClientModalOpen} 
      />

      {/* Client Details Sheet */}
      <Sheet open={!!selectedClient} onOpenChange={handleCloseDetails}>
        <SheetContent className="w-full sm:max-w-md">
          {selectedClient && <ClientDetails clientId={selectedClient} onClose={handleCloseDetails} />}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default Clients;
