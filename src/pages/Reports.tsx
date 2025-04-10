
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { BarChart, LineChart, PieChart } from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Calendar as CalendarIcon, Download } from "lucide-react";
import { mockOrders, formatCurrency, getClientById } from "@/lib/mock-data";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // Sample data for charts
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
  ];

  const categoryData = [
    { name: "Categoria A", value: 400 },
    { name: "Categoria B", value: 300 },
    { name: "Categoria C", value: 300 },
    { name: "Categoria D", value: 200 },
  ];

  const handlePrint = () => {
    window.print();
    toast.success("Imprimindo relatório...");
  };

  const handleDownload = () => {
    toast.success("Relatório exportado com sucesso!");
  };

  // Filter orders by date range
  const filteredOrders = mockOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      (!date?.from || orderDate >= date.from) &&
      (!date?.to || orderDate <= date.to) &&
      (searchTerm === "" || 
        getClientById(order.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  // Calculate total sales
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize os dados de vendas, produtos e clientes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              Imprimir
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar nos relatórios..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left md:w-auto"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yyyy")} -{" "}
                      {format(date.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(range) => setDate(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Vendas no Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalSales)}</div>
              <div className="mt-4 h-[200px]">
                <BarChart
                  width={500}
                  height={200}
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* Chart components would go here in a real implementation */}
                </BarChart>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 h-[200px]">
                <PieChart width={400} height={200}>
                  {/* Chart components would go here in a real implementation */}
                </PieChart>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Tendência de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 h-[300px]">
                <LineChart
                  width={800}
                  height={300}
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* Chart components would go here in a real implementation */}
                </LineChart>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos no Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 px-4 text-left">Cliente</th>
                    <th className="py-2 px-4 text-left">Data</th>
                    <th className="py-2 px-4 text-right">Total</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const client = getClientById(order.clientId);
                    return (
                      <tr key={order.id} className="border-b">
                        <td className="py-3 px-4">{client?.name}</td>
                        <td className="py-3 px-4">
                          {format(new Date(order.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status === "approved"
                              ? "Aprovado"
                              : order.status === "pending"
                              ? "Pendente"
                              : order.status === "in_progress"
                              ? "Em Progresso"
                              : order.status === "completed"
                              ? "Concluído"
                              : "Cancelado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
