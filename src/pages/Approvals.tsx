
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/status-badge";
import { mockOrders, formatCurrency, formatDate, getClientById } from "@/lib/mock-data";
import { Search, CheckCircle, XCircle, FileText, Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OrderDetails from "@/components/orders/OrderDetails";
import { toast } from "sonner";

const Approvals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  const pendingOrders = mockOrders.filter((order) => order.status === "pending");
  
  const filteredOrders = pendingOrders.filter(
    (order) => {
      const client = getClientById(order.clientId);
      return (
        client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  );

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };
  
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  const handleApproveSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Selecione pelo menos um pedido para aprovar");
      return;
    }
    
    toast.success(`${selectedOrders.length} pedido(s) aprovado(s) com sucesso`);
    setSelectedOrders([]);
  };
  
  const handleRejectSelected = () => {
    if (selectedOrders.length === 0) {
      toast.error("Selecione pelo menos um pedido para rejeitar");
      return;
    }
    
    toast.success(`${selectedOrders.length} pedido(s) rejeitado(s) com sucesso`);
    setSelectedOrders([]);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
            <p className="text-muted-foreground">
              Gerencie os pedidos que estão aguardando aprovação dos clientes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/approvals/history">Histórico</Link>
            </Button>
            <Button asChild>
              <Link to="/approvals/send">Enviar para Aprovação</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pedidos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {selectedOrders.length > 0 && (
          <div className="flex items-center justify-between bg-muted p-2 rounded-md">
            <p className="text-sm">{selectedOrders.length} pedido(s) selecionado(s)</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleRejectSelected}>
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar Selecionados
              </Button>
              <Button size="sm" onClick={handleApproveSelected}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar Selecionados
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} 
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Data de Entrega</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const client = getClientById(order.clientId);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectOrder(order.id)}
                          aria-label={`Selecionar pedido ${order.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{client?.name}</TableCell>
                      <TableCell>
                        {order.products.length > 0 
                          ? `${order.products[0].name}${order.products.length > 1 ? ` (+${order.products.length - 1})` : ''}`
                          : "Sem produtos"}
                      </TableCell>
                      <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Detalhes</span>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/orders/${order.id}/pdf`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">PDF</span>
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mais opções</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                toast.success(`Pedido aprovado: ${order.id}`);
                              }}>
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                toast.error(`Pedido rejeitado: ${order.id}`);
                              }} className="text-destructive">
                                Rejeitar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <p className="text-muted-foreground">Não há pedidos aguardando aprovação.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Side Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={handleCloseDetails}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg">
          {selectedOrder && <OrderDetails orderId={selectedOrder} onClose={handleCloseDetails} />}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default Approvals;
