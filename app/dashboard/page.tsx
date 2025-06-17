"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "../../components/layout/dashboard-layout"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useAuth } from "../../context/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const isAdmin = user?.role === "ADMIN"

  const stats = [
    {
      title: "Saldo Total",
      value: "R$ 12.450,00",
      change: "+12,5%",
      trend: "up",
      icon: Wallet,
      color: "emerald",
    },
    {
      title: "Receitas do Mês",
      value: "R$ 8.200,00",
      change: "+8,2%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Gastos do Mês",
      value: "R$ 3.750,00",
      change: "-5,1%",
      trend: "down",
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "Investimentos",
      value: "R$ 25.800,00",
      change: "+15,3%",
      trend: "up",
      icon: PieChart,
      color: "blue",
    },
  ]

  const recentTransactions = [
    { id: 1, description: "Salário", amount: "+R$ 5.200,00", type: "income", date: "Hoje" },
    { id: 2, description: "Supermercado", amount: "-R$ 280,50", type: "expense", date: "Ontem" },
    { id: 3, description: "Freelance", amount: "+R$ 1.500,00", type: "income", date: "2 dias" },
    { id: 4, description: "Conta de Luz", amount: "-R$ 145,30", type: "expense", date: "3 dias" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Bem-vindo de volta, <span className="font-semibold text-emerald-600">{user?.name}</span>! Aqui está um
              resumo das suas finanças.
            </p>
          </div>
          <Badge
            variant={isAdmin ? "default" : "secondary"}
            className={`px-3 py-1 ${isAdmin ? "bg-emerald-600" : "bg-slate-200 text-slate-700"}`}
          >
            {user?.role}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="finlife-stats-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">vs mês anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 finlife-card">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <DollarSign className="mr-2 h-5 w-5 text-emerald-600" />
                Transações Recentes
              </CardTitle>
              <CardDescription>Suas últimas movimentações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{transaction.description}</p>
                        <p className="text-sm text-slate-500">{transaction.date}</p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="finlife-card">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Target className="mr-2 h-5 w-5 text-emerald-600" />
                Metas Financeiras
              </CardTitle>
              <CardDescription>Acompanhe seu progresso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Reserva de Emergência</span>
                    <span className="text-slate-500">75%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">R$ 7.500 de R$ 10.000</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Viagem</span>
                    <span className="text-slate-500">45%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">R$ 2.250 de R$ 5.000</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Carro Novo</span>
                    <span className="text-slate-500">20%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">R$ 6.000 de R$ 30.000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Card */}
        {isAdmin && (
          <Card className="finlife-card border-emerald-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Privilégios de Administrador</CardTitle>
              <CardDescription>Recursos exclusivos disponíveis para sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-800">Gerenciar usuários</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-800">Relatórios avançados</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-800">Configurações do sistema</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
