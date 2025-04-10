
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/orders/OrderCard";
import { mockOrders, formatDate } from "@/lib/mock-data";
import { Package, Users, CheckCircle, AlertCircle, CalendarIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OrderDetails from "@/components/orders/OrderDetails";
import { addDays, isAfter, isBefore, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const filteredOrders = dateRange?.from || dateRange?.to
    ? mockOrders.filter(order => {
        if (dateRange?.from && dateRange?.to) {
          return isWithinInterval(order.createdAt, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to)
          });
        }
        
        if (dateRange?.from && !dateRange?.to) {
          return isAfter(order.createdAt, startOfDay(dateRange.from));
        }
        
        if (!dateRange?.from && dateRange?.to) {
          return isBefore(order.createdAt, endOfDay(dateRange.to));
        }
        
        return true;
      })
    : mockOrders;
  
  const pendingOrders = filteredOrders.filter((order) => order.status === "pending");
  const approvedOrders = filteredOrders.filter((order) => order.status === "approved");
  
  const totalOrders = filteredOrders.length;
  const totalClients = new Set(filteredOrders.map((order) => order.clientId)).size;
  const totalPending = pendingOrders.length;
  const totalApproved = approvedOrders.length;
  
  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

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
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                      </>
                    ) : (
                      formatDate(dateRange.from)
                    )
                  ) : (
                    "Filtrar por data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
                <div className="flex items-center justify-between p-3 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => setDateRange(undefined)}
                    size="sm"
                  >
                    Limpar
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        setDateRange({
                          from: addDays(today, -7),
                          to: today,
                        });
                      }}
                      size="sm"
                    >
                      Últimos 7 dias
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        setDateRange({
                          from: addDays(today, -30),
                          to: today,
                        });
                      }}
                      size="sm"
                    >
                      Últimos 30 dias
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
              <div className="text-4xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                pedidos registrados
              </p>
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
              <div className="text-4xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                clientes atendidos
              </p>
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
              <div className="text-4xl font-bold text-green-600">{totalApproved}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalOrders > 0 ? `${Math.round((totalApproved / totalOrders) * 100)}% dos pedidos` : '0% dos pedidos'}
              </p>
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
              <div className="text-4xl font-bold text-yellow-600">{totalPending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalOrders > 0 ? `${Math.round((totalPending / totalOrders) * 100)}% dos pedidos` : '0% dos pedidos'}
              </p>
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
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onViewDetails={() => handleViewOrderDetails(order.id)}
                />
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
                <OrderCard 
                  key={order.id} 
                  order={order}
                  onViewDetails={() => handleViewOrderDetails(order.id)}
                />
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
              {filteredOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  onViewDetails={() => handleViewOrderDetails(order.id)}
                />
              ))}
              {filteredOrders.length === 0 && (
                <div className="col-span-full text-center p-6">
                  <p className="text-muted-foreground">
                    Não há pedidos no período selecionado.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Sheet open={!!selectedOrder} onOpenChange={handleCloseOrderDetails}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg">
          {selectedOrder && <OrderDetails orderId={selectedOrder} onClose={handleCloseOrderDetails} />}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default Dashboard;
