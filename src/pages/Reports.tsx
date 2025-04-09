
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders, formatCurrency, formatDate, getClientById } from "@/lib/mock-data";
import { CalendarIcon, Download, FileText, Printer } from "lucide-react";
import { addDays, format, isAfter, isBefore, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OrderDetails from "@/components/orders/OrderDetails";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const filteredOrders = dateRange.from || dateRange.to
    ? mockOrders.filter(order => {
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(order.createdAt, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to)
          });
        }
        
        if (dateRange.from && !dateRange.to) {
          return isAfter(order.createdAt, startOfDay(dateRange.from));
        }
        
        if (!dateRange.from && dateRange.to) {
          return isBefore(order.createdAt, endOfDay(dateRange.to));
        }
        
        return true;
      })
    : mockOrders;
  
  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };
  
  // Prepare data for charts
  const statusData = [
    { name: "Aprovados", value: filteredOrders.filter(o => o.status === "approved").length },
    { name: "Pendentes", value: filteredOrders.filter(o => o.status === "pending").length },
    { name: "Rejeitados", value: filteredOrders.filter(o => o.status === "rejected").length },
    { name: "Rascunhos", value: filteredOrders.filter(o => o.status === "draft").length },
  ];
  
  const paymentData = [
    { name: "Dinheiro", value: filteredOrders.filter(o => o.paymentMethod === "cash").length },
    { name: "Cartão", value: filteredOrders.filter(o => o.paymentMethod === "credit_card").length },
    { name: "Transferência", value: filteredOrders.filter(o => o.paymentMethod === "bank_transfer").length },
    { name: "PIX", value: filteredOrders.filter(o => o.paymentMethod === "pix").length },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Calculate total sales by client
  const salesByClient = filteredOrders.reduce((acc, order) => {
    const client = getClientById(order.clientId);
    if (client) {
      if (!acc[client.name]) {
        acc[client.name] = 0;
      }
      acc[client.name] += order.totalAmount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const clientSalesData = Object.entries(salesByClient)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);  // Top 5 clients
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize métricas e desempenho dos seus pedidos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
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
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
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
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Status dos Pedidos</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Formas de Pagamento</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pedidos`, 'Quantidade']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-4 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Top 5 Clientes por Valor</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clientSalesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'Total']} />
                  <Legend />
                  <Bar dataKey="value" name="Valor Total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Pedidos</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todos os Pedidos</TabsTrigger>
              <TabsTrigger value="pending">Aguardando Aprovação</TabsTrigger>
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
            </TabsList>
            
            {["all", "pending", "approved", "rejected"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Data de Entrega</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders
                        .filter(order => tabValue === "all" ? true : order.status === tabValue)
                        .map((order) => {
                          const client = getClientById(order.clientId);
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                              <TableCell>{client?.name}</TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                              <TableCell>{order.paymentMethod}</TableCell>
                              <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewOrderDetails(order.id)}
                                >
                                  Detalhes
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {filteredOrders.filter(order => tabValue === "all" ? true : order.status === tabValue).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-24">
                            <p className="text-muted-foreground">Não há pedidos para exibir.</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Order Details Side Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={handleCloseOrderDetails}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg">
          {selectedOrder && <OrderDetails orderId={selectedOrder} onClose={handleCloseOrderDetails} />}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default Reports;
