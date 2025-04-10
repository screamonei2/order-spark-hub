
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockOrders, formatCurrency, formatDate, getClientById, getPaymentMethodText } from "@/lib/mock-data";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import StatusBadge from "@/components/ui/status-badge";
import { FileText, Edit, Printer } from "lucide-react";
import { toast } from "sonner";
import OrderPdfModal from "./OrderPdfModal";

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const order = mockOrders.find((o) => o.id === orderId);
  const client = order ? getClientById(order.clientId) : null;

  if (!order || !client) {
    return (
      <div className="p-4">
        <p>Pedido não encontrado.</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Fechar
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
    toast.success("Imprimindo pedido...");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    toast.success("Pedido atualizado com sucesso!");
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="mb-6">
        <SheetTitle className="flex items-center justify-between">
          <span>Detalhes do Pedido</span>
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 overflow-auto flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">#{order.id.substring(0, 8)}</h3>
            <StatusBadge status={order.status} onChange={(newStatus) => {
              order.status = newStatus;
              toast.success(`Status alterado para ${newStatus}`);
            }} />
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPdfModalOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editar Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Formulário de edição aqui...
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Entrega</p>
                    <p className="font-medium">{formatDate(order.deliveryDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                    <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-medium text-lg text-primary">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                    <div className="col-span-5">Produto</div>
                    <div className="col-span-2 text-right">Preço Unit.</div>
                    <div className="col-span-2 text-right">Qtd.</div>
                    <div className="col-span-3 text-right">Total</div>
                  </div>
                  <div className="divide-y">
                    {order.products.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 gap-4 p-3 text-sm">
                        <div className="col-span-5">{product.name}</div>
                        <div className="col-span-2 text-right">{formatCurrency(product.unitPrice)}</div>
                        <div className="col-span-2 text-right">{product.quantity}</div>
                        <div className="col-span-3 text-right font-medium">{formatCurrency(product.totalPrice)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-3 border-t bg-muted/30 text-sm font-medium">
                    <div className="col-span-9 text-right">Total do Pedido:</div>
                    <div className="col-span-3 text-right text-primary font-bold">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <OrderPdfModal 
        open={isPdfModalOpen} 
        onOpenChange={setIsPdfModalOpen} 
        orderId={orderId} 
      />
    </div>
  );
};

export default OrderDetails;
