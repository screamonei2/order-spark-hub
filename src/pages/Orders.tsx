
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
import { mockOrders, formatCurrency, formatDate, getClientById, getPaymentMethodText } from "@/lib/mock-data";
import { Search, Plus, Edit, FileText, MoreHorizontal, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OrderDetails from "@/components/orders/OrderDetails";
import NewOrderModal from "@/components/orders/NewOrderModal";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  
  const filteredOrders = mockOrders.filter(
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

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os pedidos para seus clientes.
            </p>
          </div>
          <Button onClick={() => setIsNewOrderModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Button>
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Data de Entrega</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const client = getClientById(order.clientId);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{client?.name}</TableCell>
                    <TableCell>
                      {order.products.length > 0 
                        ? `${order.products[0].name}${order.products.length > 1 ? ` (+${order.products.length - 1})` : ''}`
                        : "Sem produtos"}
                    </TableCell>
                    <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{getPaymentMethodText(order.paymentMethod)}</TableCell>
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
                          <Link to={`/orders/${order.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
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
                            <DropdownMenuItem asChild>
                              <Link to={`/orders/${order.id}/approve`}>
                                Solicitar aprovação
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/orders/${order.id}/duplicate`}>
                                Duplicar pedido
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Excluir pedido
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      {/* New Order Modal */}
      <NewOrderModal open={isNewOrderModalOpen} onOpenChange={setIsNewOrderModalOpen} />
    </AppLayout>
  );
};

export default Orders;
