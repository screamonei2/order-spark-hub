
import React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { getStatusColor, getStatusText } from "@/lib/mock-data";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getStatusColor(status),
        className
      )}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
