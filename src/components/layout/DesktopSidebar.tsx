
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { NavItem } from "@/types";

interface DesktopSidebarProps {
  sidebarItems: NavItem[];
  handleLogout: () => void;
  user: { name: string; email?: string };
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ 
  sidebarItems, 
  handleLogout,
  user 
}) => {
  return (
    <SidebarProvider>
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
                  {user.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
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
    </SidebarProvider>
  );
};

export default DesktopSidebar;
