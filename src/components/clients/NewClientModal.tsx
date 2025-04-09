
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client } from "@/types";
import { toast } from "sonner";
import ClientForm from "./ClientForm";
import { mockClients } from "@/lib/mock-data";

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ open, onOpenChange }) => {
  const handleSubmit = (values: Omit<Client, "id" | "createdAt">) => {
    console.log("New client values:", values);
    
    // In a real app, you would call an API to create the client
    // For now, we'll just simulate adding the client to the mock data
    const newClient: Client = {
      ...values,
      id: `c${mockClients.length + 1}`,
      createdAt: new Date(),
    };
    
    // Here you would normally add the client to your state or context
    console.log("New client created:", newClient);
    
    toast.success("Cliente cadastrado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        <ClientForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewClientModal;
