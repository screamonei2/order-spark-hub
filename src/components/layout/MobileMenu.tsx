
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { NavItem } from "@/types";
import { toast } from "sonner";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarItems: NavItem[];
  handleLogout: () => void;
  user: { name: string; email?: string };
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  sidebarItems, 
  handleLogout,
  user 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in lg:hidden">
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      <div
        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left sm:duration-300 translate-x-0"
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">OrderSparkHub</h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-6 flex flex-1 flex-col gap-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
