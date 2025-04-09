
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { getStatusColor, getStatusText } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
  onChange?: (newStatus: OrderStatus) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, onChange }) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(status);
  
  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    if (onChange) {
      onChange(newStatus);
    } else {
      toast.success(`Status alterado para: ${getStatusText(newStatus)}`);
    }
  };
  
  if (!onChange) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          getStatusColor(currentStatus),
          className
        )}
      >
        {getStatusText(currentStatus)}
      </span>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer",
            getStatusColor(currentStatus),
            className
          )}
        >
          {getStatusText(currentStatus)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange("draft")}>
          {getStatusText("draft")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
          {getStatusText("pending")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("approved")}>
          {getStatusText("approved")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
          {getStatusText("rejected")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusBadge;
