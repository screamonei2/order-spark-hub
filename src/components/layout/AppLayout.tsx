
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { BarChart3, Package, Users, FileText, ClipboardCheck, LogOut, Menu, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();
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

  const sidebarItems = [
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar */}
      {isMobile && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in lg:hidden">
          <div
            className={`fixed inset-0 z-50 ${sidebarOpen ? "block" : "hidden"}`}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left sm:duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-xl font-bold">OrderSparkHub</h1>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex flex-1 flex-col gap-4">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
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
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar className="border-r">
          <div className="flex h-full flex-col">
            <div className="py-4">
              <Link to="/" className="flex items-center justify-center">
                <h1 className="font-bold">OrderSparkHub</h1>
              </Link>
            </div>
            <Separator />
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      item.active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <Separator />
            <div className="py-4">
              <div className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <nav className="grid gap-1 px-2">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </nav>
            </div>
          </div>
        </Sidebar>
      )}

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex h-14 items-center border-b px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 font-semibold">OrderSparkHub</div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
