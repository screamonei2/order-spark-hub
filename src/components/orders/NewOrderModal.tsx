import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { mockClients, formatCurrency, getProductById, mockProducts } from "@/lib/mock-data";
import { format } from "date-fns";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrderProduct, OrderStatus, PaymentMethod } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: "draft", label: "Rascunho" },
  { value: "pending", label: "Aguardando Aprovação" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
];

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Dinheiro" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "bank_transfer", label: "Transferência Bancária" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
];

const NewOrderModal: React.FC<NewOrderModalProps> = ({ open, onOpenChange }) => {
  const [selectedTab, setSelectedTab] = useState("info");
  const [clientId, setClientId] = useState("");
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<OrderStatus>("draft");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [notes, setNotes] = useState("");
  
  const totalAmount = orderProducts.reduce((sum, product) => sum + product.totalPrice, 0);

  const handleAddProduct = () => {
    const newProduct: OrderProduct = {
      id: `temp-${Date.now()}`,
      productId: "",
      name: "",
      unitPrice: 0,
      quantity: 1,
      totalPrice: 0,
    };
    setOrderProducts([...orderProducts, newProduct]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...orderProducts];
    newProducts.splice(index, 1);
    setOrderProducts(newProducts);
  };

  const handleProductChange = (index: number, field: keyof OrderProduct, value: any) => {
    const newProducts = [...orderProducts];
    const product = { ...newProducts[index] };
    
    if (field === "productId" && value) {
      const selectedProduct = getProductById(value);
      if (selectedProduct) {
        product.name = selectedProduct.name;
        product.unitPrice = selectedProduct.price;
        product.productId = selectedProduct.id;
      }
    }
    
    (product[field] as any) = value;
    
    if (field === "quantity" || field === "unitPrice" || field === "productId") {
      product.totalPrice = product.quantity * product.unitPrice;
    }
    
    newProducts[index] = product;
    setOrderProducts(newProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      toast.error("Por favor, selecione um cliente");
      return;
    }
    
    if (orderProducts.length === 0) {
      toast.error("Por favor, adicione pelo menos um produto");
      return;
    }
    
    if (!deliveryDate) {
      toast.error("Por favor, selecione uma data de entrega");
      return;
    }
    
    if (orderProducts.some(p => !p.name || p.quantity <= 0)) {
      toast.error("Por favor, preencha todos os campos dos produtos corretamente");
      return;
    }
    
    toast.success("Pedido criado com sucesso!");
    
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setClientId("");
    setOrderProducts([]);
    setDeliveryDate(undefined);
    setStatus("draft");
    setPaymentMethod("pix");
    setNotes("");
    setSelectedTab("info");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="summary">Resumo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select value={clientId} onValueChange={setClientId}>
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
                
                <div className="grid gap-2">
                  <Label htmlFor="delivery-date">Data de Entrega *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "dd/MM/yyyy") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">Forma de Pagamento</Label>
                    <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Selecione uma forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Informações adicionais sobre o pedido"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setSelectedTab("products")}>
                  Avançar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4 py-4">
              <div className="space-y-4">
                {orderProducts.length === 0 ? (
                  <div className="text-center p-4 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">Nenhum produto adicionado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderProducts.map((product, index) => (
                      <div key={product.id} className="grid grid-cols-12 gap-3 items-end border p-3 rounded-md">
                        <div className="col-span-12 md:col-span-4">
                          <Label htmlFor={`product-${index}`}>Produto</Label>
                          <Select 
                            value={product.productId} 
                            onValueChange={(value) => handleProductChange(index, "productId", value)}
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
                        
                        <div className="col-span-4 md:col-span-2">
                          <Label htmlFor={`price-${index}`}>Preço Unit.</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            value={product.unitPrice}
                            onChange={(e) => handleProductChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        
                        <div className="col-span-4 md:col-span-2">
                          <Label htmlFor={`quantity-${index}`}>Quantidade</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                        
                        <div className="col-span-3 md:col-span-3">
                          <Label>Total</Label>
                          <div className="h-10 px-3 py-2 rounded-md border bg-muted/30 flex items-center">
                            {formatCurrency(product.totalPrice)}
                          </div>
                        </div>
                        
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProduct(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddProduct}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-lg font-bold">
                    Total do Pedido: {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedTab("info")}>
                  Voltar
                </Button>
                <Button type="button" onClick={() => setSelectedTab("summary")}>
                  Avançar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="border rounded-md p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold">Informações do Cliente</h3>
                    <Separator className="my-2" />
                    <p>
                      {clientId ? mockClients.find(c => c.id === clientId)?.name || "Nenhum cliente selecionado" : "Nenhum cliente selecionado"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Informações do Pedido</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Entrega</p>
                        <p>{deliveryDate ? format(deliveryDate, "dd/MM/yyyy") : "Não selecionada"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p>{orderStatusOptions.find(o => o.value === status)?.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                        <p>{paymentMethodOptions.find(o => o.value === paymentMethod)?.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-primary">{formatCurrency(totalAmount)}</p>
                      </div>
                    </div>
                    {notes && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Observações</p>
                        <p>{notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Produtos</h3>
                    <Separator className="my-2" />
                    {orderProducts.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum produto adicionado</p>
                    ) : (
                      <div className="border rounded-md">
                        <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                          <div className="col-span-5">Produto</div>
                          <div className="col-span-2 text-right">Preço Unit.</div>
                          <div className="col-span-2 text-right">Qtd.</div>
                          <div className="col-span-3 text-right">Total</div>
                        </div>
                        <div className="divide-y">
                          {orderProducts.map((product) => (
                            <div key={product.id} className="grid grid-cols-12 gap-4 p-3 text-sm">
                              <div className="col-span-5">{product.name || "Produto sem nome"}</div>
                              <div className="col-span-2 text-right">{formatCurrency(product.unitPrice)}</div>
                              <div className="col-span-2 text-right">{product.quantity}</div>
                              <div className="col-span-3 text-right font-medium">{formatCurrency(product.totalPrice)}</div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-12 gap-4 p-3 border-t bg-muted/30 text-sm font-medium">
                          <div className="col-span-9 text-right">Total do Pedido:</div>
                          <div className="col-span-3 text-right text-primary font-bold">
                            {formatCurrency(totalAmount)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedTab("products")}>
                  Voltar
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Pedido</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderModal;
