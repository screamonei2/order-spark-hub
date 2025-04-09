
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/orders/OrderCard";
import { mockOrders } from "@/lib/mock-data";
import { Package, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const pendingOrders = mockOrders.filter((order) => order.status === "pending");
  const approvedOrders = mockOrders.filter((order) => order.status === "approved");
  
  const totalOrders = mockOrders.length;
  const totalClients = new Set(mockOrders.map((order) => order.clientId)).size;
  const totalPending = pendingOrders.length;
  const totalApproved = approvedOrders.length;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Gerencie seus pedidos e acompanhe o status de aprovação.
            </p>
          </div>
          <Button asChild>
            <Link to="/orders/new">Novo Pedido</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total de Pedidos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total de Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Pedidos Aprovados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApproved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Aguardando Aprovação
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Aguardando Aprovação</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
            <TabsTrigger value="all">Todos os Pedidos</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {pendingOrders.length === 0 && (
                <div className="col-span-full text-center p-6">
                  <p className="text-muted-foreground">
                    Não há pedidos aguardando aprovação.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {approvedOrders.length === 0 && (
                <div className="col-span-full text-center p-6">
                  <p className="text-muted-foreground">
                    Não há pedidos aprovados.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
