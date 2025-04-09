
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { mockOrders, formatCurrency, formatDate, getClientById } from "@/lib/mock-data";
import { Search, CheckCircle, XCircle, FileText, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Approvals = () => {
  const pendingOrders = mockOrders.filter((order) => order.status === "pending");

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
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => {
              const client = getClientById(order.clientId);
              return (
                <Card key={order.id} className="overflow-hidden">
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
                        {order.products.map((product) => (
                          <li key={product.id} className="text-sm">
                            {product.name} ({product.quantity}x)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Entrega</p>
                      <p className="text-sm">{formatDate(order.deliveryDate)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/40 p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Detalhes
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/orders/${order.id}/pdf`}>
                          <FileText className="mr-2 h-4 w-4" />
                          PDF
                        </Link>
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar
                      </Button>
                      <Button size="sm" variant="default">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center p-6">
              <p className="text-muted-foreground">
                Não há pedidos aguardando aprovação.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Approvals;
