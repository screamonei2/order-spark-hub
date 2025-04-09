
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Users, List, FileText, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  current: boolean;
}

const NavItem = ({ href, icon, label, current }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      current
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    {icon}
    {label}
  </Link>
);

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { href: "/", icon: <Home size={18} />, label: "Dashboard" },
    { href: "/orders", icon: <Package size={18} />, label: "Pedidos" },
    { href: "/clients", icon: <Users size={18} />, label: "Clientes" },
    { href: "/approvals", icon: <List size={18} />, label: "Aprovações" },
    { href: "/reports", icon: <FileText size={18} />, label: "Relatórios" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="border-r bg-card w-full md:w-64 flex-shrink-0">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-blue" />
            <span>OrderSparkHub</span>
          </h1>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              current={
                item.href === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.href)
              }
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
