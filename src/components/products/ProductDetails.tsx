
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { mockProducts, formatCurrency, formatDate } from "@/lib/mock-data";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Edit } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductDetailsProps {
  productId: string;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onClose }) => {
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

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="mb-6">
        <SheetTitle className="flex items-center justify-between">
          <span>Detalhes do Produto</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 overflow-auto flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/products/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
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
                <p className="text-sm text-muted-foreground">Preço</p>
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
            <div>
              <p className="text-sm text-muted-foreground">Descrição</p>
              <p className="font-medium">{product.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
