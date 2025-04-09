
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, formatCurrency } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Download, FileText, PieChart, BarChart as BarChartIcon } from "lucide-react";

const Reports = () => {
  // Calculate totals
  const totalSales = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const approvedSales = mockOrders
    .filter((order) => order.status === "approved")
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingSales = mockOrders
    .filter((order) => order.status === "pending")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Status distribution data
  const statusData = [
    {
      name: "Aprovados",
      value: mockOrders.filter((order) => order.status === "approved").length,
      color: "#22c55e",
    },
    {
      name: "Pendentes",
      value: mockOrders.filter((order) => order.status === "pending").length,
      color: "#eab308",
    },
    {
      name: "Rejeitados",
      value: mockOrders.filter((order) => order.status === "rejected").length,
      color: "#ef4444",
    },
    {
      name: "Rascunhos",
      value: mockOrders.filter((order) => order.status === "draft").length,
      color: "#94a3b8",
    },
  ];

  // Client data
  const clientData = Array.from(
    mockOrders.reduce((acc, order) => {
      const clientId = order.clientId;
      const currentTotal = acc.get(clientId) || 0;
      return acc.set(clientId, currentTotal + order.totalAmount);
    }, new Map())
  ).map(([clientId, total]) => {
    const client = mockOrders.find((order) => order.clientId === clientId)?.clientId;
    return {
      name: `Client ${client?.split("c")[1]}`,
      value: total,
    };
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize relatórios e estatísticas de seus pedidos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <a href="#" download>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#" download>
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento Total
              </CardTitle>
              <CardDescription>Todos os pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos Aprovados
              </CardTitle>
              <CardDescription>Valor total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(approvedSales)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos Pendentes
              </CardTitle>
              <CardDescription>Valor total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(pendingSales)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Status dos Pedidos</CardTitle>
                <CardDescription>
                  Distribuição de pedidos por status
                </CardDescription>
              </div>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip
                    formatter={(value: number) => [`${value} pedidos`, "Quantidade"]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Faturamento por Cliente</CardTitle>
                <CardDescription>
                  Valores totais por cliente
                </CardDescription>
              </div>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        notation: "compact",
                        compactDisplay: "short",
                        style: "currency",
                        currency: "BRL",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Faturamento",
                    ]}
                  />
                  <Bar
                    dataKey="value"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
