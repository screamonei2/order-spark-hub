
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Order } from "@/types";
import { getClientById, formatCurrency, formatDate } from "@/lib/mock-data";
import StatusBadge from "@/components/ui/status-badge";
import { Eye, FileText, Edit } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onViewDetails?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const client = getClientById(order.clientId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{client?.name}</CardTitle>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Total do Pedido</p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Produtos</p>
          <ul className="space-y-1 mt-1">
            {order.products.slice(0, 2).map((product) => (
              <li key={product.id} className="text-sm">
                {product.name} ({product.quantity}x)
              </li>
            ))}
            {order.products.length > 2 && (
              <li className="text-sm text-muted-foreground">
                + {order.products.length - 2} outros produtos
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de Entrega</p>
          <p className="text-sm">{formatDate(order.deliveryDate)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t bg-muted/40 p-3">
        {onViewDetails ? (
          <Button size="sm" variant="outline" onClick={onViewDetails} className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            Detalhes
          </Button>
        ) : (
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link to={`/orders/${order.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Detalhes
            </Link>
          </Button>
        )}
        <Button size="sm" variant="outline" asChild className="flex-1">
          <Link to={`/orders/${order.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild className="flex-1">
          <Link to={`/orders/${order.id}/pdf`}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
