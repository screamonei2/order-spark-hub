import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  ClipboardList,
  FileCheck,
  Layers,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SidebarMenuProps {
  isMobile: boolean;
  onMenuClose: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Produtos",
    href: "/products",
    icon: <Package className="mr-2 h-4 w-4" />,
  },
  {
    title: "Clientes",
    href: "/clients",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Pedidos",
    href: "/orders",
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
  },
  {
    title: "Relatórios",
    href: "/reports",
    icon: <BarChart3 className="mr-2 h-4 w-4" />,
  },
  {
    title: "Aprovações",
    href: "/approvals",
    icon: <FileCheck className="mr-2 h-4 w-4" />,
  },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isMobile, onMenuClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          OrderSparkHub
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuClose}>
            <Check className="h-6 w-6" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start pl-9",
                  location.pathname === item.href && "font-semibold"
                )}
                onClick={isMobile ? onMenuClose : undefined}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="justify-start pl-9 hover:bg-secondary/50 data-[state=open]:bg-secondary/50"
              >
                <Layers className="mr-2 h-4 w-4" />
                <span>Admin</span>
                <ChevronRight className="mr-2 h-4 w-4 ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              <Link to="/settings">
                <Button
                  variant="ghost"
                  className={cn("justify-start pl-12")}
                  size="sm"
                  onClick={isMobile ? onMenuClose : undefined}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="mt-auto mb-2 flex aspect-square h-10 w-10 p-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Link to="/profile">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SidebarMenu;
