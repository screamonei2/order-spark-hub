
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

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ open, onOpenChange }) => {
  const handleSubmit = (values: Omit<Client, "id" | "createdAt">) => {
    console.log("New client values:", values);
    // Here you would normally submit to an API
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
