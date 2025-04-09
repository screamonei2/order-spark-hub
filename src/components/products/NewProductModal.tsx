
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/mock-data";
import { toast } from "sonner";

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error("Por favor, insira o nome do produto");
      return;
    }
    
    if (!category.trim()) {
      toast.error("Por favor, insira a categoria do produto");
      return;
    }
    
    if (price <= 0) {
      toast.error("Por favor, insira um preço válido");
      return;
    }
    
    // Here you would normally submit the data to your backend
    toast.success("Produto criado com sucesso!");
    
    // Reset form and close modal
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setCategory("");
    setSku("");
    setStock(undefined);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                placeholder="Digite o nome do produto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Digite a descrição do produto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  placeholder="Digite a categoria"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Digite o código SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Quantidade em estoque"
                  value={stock === undefined ? "" : stock}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    setStock(value);
                  }}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Produto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductModal;
