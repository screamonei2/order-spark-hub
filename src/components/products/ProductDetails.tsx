
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { mockProducts, formatCurrency, formatDate } from "@/lib/mock-data";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Edit, Printer } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "./ProductForm";

interface ProductDetailsProps {
  productId: string;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-4">
        <p>Produto não encontrado.</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Fechar
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
    toast.success("Imprimindo produto...");
  };

  const handleSubmit = (values: any) => {
    console.log("Updated product:", values);
    toast.success("Produto atualizado com sucesso!");
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="mb-6">
        <SheetTitle className="flex items-center justify-between">
          <span>Detalhes do Produto</span>
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 overflow-auto flex-1">
        {isEditing ? (
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar Produto</h3>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
            <ProductForm 
              onSubmit={handleSubmit} 
              defaultValues={{
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                costPrice: product.costPrice || 0,
                sku: product.sku,
                stock: product.stock,
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">{product.sku || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preço de Custo</p>
                    <p className="font-medium text-muted-foreground">{formatCurrency(product.costPrice || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preço Final</p>
                    <p className="font-medium text-primary">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estoque</p>
                    <p className="font-medium">{product.stock || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                    <p className="font-medium">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
                {product.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="font-medium">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
