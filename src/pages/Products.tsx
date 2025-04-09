
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockProducts, formatCurrency } from "@/lib/mock-data";
import { Search, Plus, Edit, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ProductDetails from "@/components/products/ProductDetails";
import NewProductModal from "@/components/products/NewProductModal";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  
  const filteredProducts = mockProducts.filter(
    (product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie os produtos para seus pedidos.
            </p>
          </div>
          <Button onClick={() => setIsNewProductModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.sku || "-"}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(product.id)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Detalhes</span>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mais opções</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Atualizar estoque
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Excluir produto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Product Details Side Sheet */}
      <Sheet open={!!selectedProduct} onOpenChange={handleCloseDetails}>
        <SheetContent className="w-full sm:max-w-md">
          {selectedProduct && <ProductDetails productId={selectedProduct} onClose={handleCloseDetails} />}
        </SheetContent>
      </Sheet>

      {/* New Product Modal */}
      <NewProductModal open={isNewProductModalOpen} onOpenChange={setIsNewProductModalOpen} />
    </AppLayout>
  );
};

export default Products;
