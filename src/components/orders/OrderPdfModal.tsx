
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, formatCurrency, formatDate, getClientById, getPaymentMethodText } from "@/lib/mock-data";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

interface OrderPdfModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const OrderPdfModal: React.FC<OrderPdfModalProps> = ({ open, onOpenChange, orderId }) => {
  const order = mockOrders.find((o) => o.id === orderId);
  const client = order ? getClientById(order.clientId) : null;

  const handlePrint = () => {
    window.print();
    toast.success("Imprimindo pedido...");
  };

  const handleDownload = () => {
    toast.success("PDF baixado com sucesso!");
    // In a real app, you'd generate and download the PDF here
  };

  if (!order || !client) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualização do PDF</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>

        <Card className="overflow-hidden border-4 print:border-0">
          <CardHeader className="border-b bg-muted/40 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Pedido #{order.id.substring(0, 8)}
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
                {order.notes || "Agradecemos a preferência. Para mais informações, entre em contato conosco."}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6 bg-muted/40">
            <p className="text-sm text-muted-foreground">
              Este documento serve como prova de pedido e não tem valor fiscal.
            </p>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPdfModal;
