
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, Package, Users, FileText, ClipboardCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { NavItem } from "@/types";
import DesktopSidebar from "./DesktopSidebar";
import MobileMenu from "./MobileMenu";
import MainContent from "./MainContent";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const user = localStorage.getItem("user") ? 
    JSON.parse(localStorage.getItem("user") || "{}") : 
    { name: "Usuário" };

  const sidebarItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/",
      active: location.pathname === "/",
    },
    {
      title: "Pedidos",
      icon: <FileText className="h-5 w-5" />,
      href: "/orders",
      active: location.pathname === "/orders",
    },
    {
      title: "Produtos",
      icon: <Package className="h-5 w-5" />,
      href: "/products",
      active: location.pathname === "/products",
    },
    {
      title: "Clientes",
      icon: <Users className="h-5 w-5" />,
      href: "/clients",
      active: location.pathname === "/clients",
    },
    {
      title: "Aprovações",
      icon: <ClipboardCheck className="h-5 w-5" />,
      href: "/approvals",
      active: location.pathname === "/approvals",
    },
    {
      title: "Relatórios",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/reports",
      active: location.pathname === "/reports",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileMenu
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sidebarItems={sidebarItems}
            handleLogout={handleLogout}
            user={user}
          />
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <DesktopSidebar
            sidebarItems={sidebarItems}
            handleLogout={handleLogout}
            user={user}
          />
        )}

        {/* Main Content */}
        <MainContent 
          isMobile={isMobile} 
          onMenuOpen={() => setSidebarOpen(true)}
        >
          {children}
        </MainContent>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
