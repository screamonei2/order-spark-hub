
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";
import StatusBadge from "@/components/ui/status-badge";
import { formatCurrency, formatDate, getClientById, getPaymentMethodText } from "@/lib/mock-data";
import { Edit, FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails?: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewDetails }) => {
  return (
    <div className="relative overflow-x-auto rounded-lg border bg-card">
      <div className="hidden grid-cols-orders gap-4 p-4 text-sm font-medium text-muted-foreground md:grid border-b">
        <div>Produto/Cliente</div>
        <div>Data de Entrega</div>
        <div>Valor</div>
        <div>Pagamento</div>
        <div>Status</div>
        <div className="text-right">Ações</div>
      </div>
      <div className="divide-y">
        {orders.map((order) => {
          const client = getClientById(order.clientId);
          return (
            <div
              key={order.id}
              className="grid grid-cols-1 md:grid-cols-orders gap-4 p-4 text-sm cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDetails && onViewDetails(order.id)}
            >
              <div className="flex flex-col">
                <div className="font-medium">
                  {order.products.length > 0
                    ? order.products[0].name
                    : "Sem produtos"}
                </div>
                <div className="text-muted-foreground">{client?.name}</div>
              </div>
              <div className="flex items-center">{formatDate(order.deliveryDate)}</div>
              <div className="flex items-center font-medium">
                {formatCurrency(order.totalAmount)}
              </div>
              <div className="flex items-center">
                {getPaymentMethodText(order.paymentMethod)}
              </div>
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <StatusBadge 
                  status={order.status} 
                  onChange={(newStatus) => {
                    order.status = newStatus;
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersTable;
