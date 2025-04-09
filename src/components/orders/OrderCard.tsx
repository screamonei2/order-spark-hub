
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import { Order } from "@/types";
import { formatCurrency, formatDate, getClientById, getPaymentMethodText } from "@/lib/mock-data";
import { FileText, Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const client = getClientById(order.clientId);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <h3 className="font-medium">{client?.name}</h3>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Produtos</p>
              <p className="font-medium">{order.products.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entrega</p>
              <p className="font-medium">{formatDate(order.deliveryDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pagamento</p>
              <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium text-primary">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/40 p-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/orders/${order.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/orders/${order.id}/pdf`}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
