
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockClients, mockProducts, formatCurrency } from "@/lib/mock-data";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client, OrderProduct, PaymentMethod, Product } from "@/types";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const NewOrder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get client ID from URL parameter if available
  const clientIdFromUrl = searchParams.get("client");
  
  // Client selection
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clientIdFromUrl || ""
  );
  const selectedClient = mockClients.find(
    (client) => client.id === selectedClientId
  );

  // Order products
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  
  // Order details
  const [deliveryDate, setDeliveryDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 7 days from now
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [notes, setNotes] = useState<string>("");

  // Calculate total amount
  const totalAmount = orderProducts.reduce(
    (sum, product) => sum + product.totalPrice,
    0
  );

  // Handle adding a new empty product to the order
  const handleAddProduct = () => {
    setOrderProducts([
      ...orderProducts,
      {
        id: `temp-${Date.now()}`,
        productId: "", // Adding the required field
        name: "",
        unitPrice: 0,
        quantity: 1,
        totalPrice: 0,
      },
    ]);
  };

  // Handle selecting a product from the dropdown
  const handleProductSelect = (productId: string, index: number) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return;

    const updatedProducts = [...orderProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      totalPrice: product.price * updatedProducts[index].quantity,
    };

    setOrderProducts(updatedProducts);
  };

  // Handle updating quantity of a product
  const handleQuantityChange = (quantity: number, index: number) => {
    const updatedProducts = [...orderProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantity,
      totalPrice: updatedProducts[index].unitPrice * quantity,
    };

    setOrderProducts(updatedProducts);
  };

  // Handle removing a product from the order
  const handleRemoveProduct = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!selectedClientId) {
      toast({
        title: "Cliente obrigatório",
        description: "Por favor, selecione um cliente para o pedido.",
        variant: "destructive",
      });
      return;
    }

    if (orderProducts.length === 0) {
      toast({
        title: "Produtos obrigatórios",
        description: "Por favor, adicione pelo menos um produto ao pedido.",
        variant: "destructive",
      });
      return;
    }

    if (orderProducts.some(p => !p.name || p.unitPrice <= 0)) {
      toast({
        title: "Produto inválido",
        description: "Verifique se todos os produtos estão preenchidos corretamente.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, here we would save the order
    // For now, we'll just show a success message and navigate to the orders page

    toast({
      title: "Pedido criado com sucesso!",
      description: `Pedido para ${selectedClient?.name} criado.`,
    });

    navigate("/orders");
  };

  // Initialize with one empty product if there are none
  useEffect(() => {
    if (orderProducts.length === 0) {
      handleAddProduct();
    }
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Pedido</h1>
            <p className="text-muted-foreground">
              Crie um novo pedido para seu cliente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="client">Selecione o Cliente</Label>
                <Select
                  value={selectedClientId}
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <div className="rounded-md border p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome Fantasia</p>
                      <p className="font-medium">{selectedClient.tradingName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Razão Social</p>
                      <p className="font-medium">{selectedClient.legalName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CNPJ</p>
                      <p className="font-medium">{selectedClient.taxId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contato</p>
                      <p className="font-medium">{selectedClient.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Produtos</CardTitle>
              <Button type="button" onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="grid grid-cols-12 gap-2 items-center border-b pb-4"
                >
                  <div className="col-span-12 md:col-span-4">
                    <Label htmlFor={`product-${index}`}>Produto</Label>
                    <Select
                      value={product.productId}
                      onValueChange={(value) => handleProductSelect(value, index)}
                    >
                      <SelectTrigger id={`product-${index}`}>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-5 md:col-span-3">
                    <Label htmlFor={`price-${index}`}>Preço Unitário</Label>
                    <Input
                      id={`price-${index}`}
                      value={product.unitPrice ? product.unitPrice.toString() : ""}
                      onChange={(e) => {
                        const updatedProducts = [...orderProducts];
                        const value = parseFloat(e.target.value) || 0;
                        updatedProducts[index] = {
                          ...updatedProducts[index],
                          unitPrice: value,
                          totalPrice: value * updatedProducts[index].quantity,
                        };
                        setOrderProducts(updatedProducts);
                      }}
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantidade</Label>
                    <Input
                      id={`quantity-${index}`}
                      value={product.quantity}
                      onChange={(e) => 
                        handleQuantityChange(
                          parseInt(e.target.value) || 1,
                          index
                        )
                      }
                      type="number"
                      min="1"
                      step="1"
                    />
                  </div>
                  
                  <div className="col-span-6 md:col-span-2">
                    <Label>Total</Label>
                    <p className="h-10 flex items-center font-medium">
                      {formatCurrency(product.totalPrice)}
                    </p>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1 flex justify-end items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(index)}
                      className="h-10 w-10"
                      disabled={orderProducts.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <div className="w-full md:w-1/3 space-y-2">
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total do Pedido:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="delivery-date">Data de Entrega</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="delivery-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? (
                          format(deliveryDate, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={(date) => date && setDeliveryDate(date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="payment-method">Forma de Pagamento</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => 
                      setPaymentMethod(value as PaymentMethod)
                    }
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                      <SelectItem value="bank_transfer">
                        Transferência Bancária
                      </SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione instruções especiais, detalhes sobre personalização ou outras observações..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <CardFooter className="flex justify-between border rounded-lg p-4 bg-muted/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/orders")}
            >
              Cancelar
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="secondary">
                Salvar como Rascunho
              </Button>
              <Button type="submit">Criar Pedido</Button>
            </div>
          </CardFooter>
        </form>
      </div>
    </AppLayout>
  );
};

export default NewOrder;
