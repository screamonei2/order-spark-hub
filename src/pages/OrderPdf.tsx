
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, formatCurrency, formatDate, getClientById, getPaymentMethodText } from "@/lib/mock-data";
import { ArrowLeft, Download, Printer } from "lucide-react";

const OrderPdf = () => {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id);
  const client = order ? getClientById(order.clientId) : null;

  if (!order || !client) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
          <p className="mb-4">O pedido que você está procurando não existe.</p>
          <Button asChild>
            <Link to="/orders">Voltar para Pedidos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to={`/orders/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-4 print:border-0">
        <CardHeader className="border-b bg-muted/40 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Pedido #{order.id}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Criado em: {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">OrderSparkHub</h2>
              <p className="text-sm text-muted-foreground">
                seu-email@example.com
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap gap-8 justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Dados do Cliente</h3>
              <div className="space-y-1">
                <p className="font-medium">{client.name}</p>
                <p>{client.legalName}</p>
                <p>CNPJ: {client.taxId}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalhes do Pedido</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {order.status === "pending" ? "Aguardando Aprovação" : order.status === "approved" ? "Aprovado" : "Outro Status"}
                </p>
                <p>
                  <span className="font-medium">Data de Entrega:</span>{" "}
                  {formatDate(order.deliveryDate)}
                </p>
                <p>
                  <span className="font-medium">Pagamento:</span>{" "}
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Produtos</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Produto</th>
                    <th className="py-2 px-4 text-right">Qtd.</th>
                    <th className="py-2 px-4 text-right">Preço Unit.</th>
                    <th className="py-2 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4 text-right">{product.quantity}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(product.unitPrice)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(product.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-1">
              <div className="flex justify-between border-b py-1">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span>Impostos:</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Observações</h3>
            <p className="text-muted-foreground">
              Agradecemos a preferência. Para mais informações, entre em contato conosco.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/40">
          <p className="text-sm text-muted-foreground">
            Este documento serve como prova de pedido e não tem valor fiscal.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderPdf;
