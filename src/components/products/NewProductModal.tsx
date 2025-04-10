
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { toast } from "sonner";
import ProductForm from "./ProductForm";
import { mockProducts } from "@/lib/mock-data";

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({ open, onOpenChange }) => {
  const handleSubmit = (values: Omit<Product, "id" | "createdAt">) => {
    console.log("New product values:", values);
    
    // In a real app, you would call an API to create the product
    // For now, we'll just simulate adding the product to the mock data
    const newProduct: Product = {
      ...values,
      id: `p${mockProducts.length + 1}`,
      createdAt: new Date(),
    };
    
    // Here you would normally add the product to your state or context
    console.log("New product created:", newProduct);
    
    toast.success("Produto cadastrado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Produto</DialogTitle>
        </DialogHeader>
        <ProductForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewProductModal;
