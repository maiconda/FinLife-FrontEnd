"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { financeiroApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Users, Crown, UserCheck } from "lucide-react"
import { formatRole, formatCurrency } from "@/lib/utils"
import type { Metadata } from "@/types/financeiro"

export function MainDashboard() {
  const { user, role } = useAuth()
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMetadata = async () => {
    try {
      const response = await financeiroApi.getMetadata()
      setMetadata(response.data)
    } catch (error) {
      console.error("Erro ao carregar metadata:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetadata()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Olá, {user?.user.nome}</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">Sua função:</span>
          <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
            {role === "ADMIN" ? (
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                <span>{formatRole("ADMIN")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <UserCheck className="h-3 w-3" />
                <span>{formatRole("MEMBRO")}</span>
              </div>
            )}
          </Badge>
        </div>
      </div>

      {/* Dados Pessoais */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Seus Dados Financeiros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Totais</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {metadata ? formatCurrency(metadata.gastoTotal) : "R$ 0,00"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {metadata ? formatCurrency(metadata.gastoDoMes) : "R$ 0,00"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entradas Totais</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metadata ? formatCurrency(metadata.entradasTotais) : "R$ 0,00"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entradas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metadata ? formatCurrency(metadata.entradasMes) : "R$ 0,00"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dados do Grupo - Apenas para ADMIN */}
      {role === "ADMIN" && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dados do Grupo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos Totais do Grupo</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metadata ? formatCurrency(metadata.gastosTotaisDoGrupo) : "R$ 0,00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos do Grupo (Mês)</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metadata ? formatCurrency(metadata.gastosTotaisDoGrupoMes) : "R$ 0,00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entradas Totais do Grupo</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metadata ? formatCurrency(metadata.entradasTotaisGrupo) : "R$ 0,00"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entradas do Grupo (Mês)</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metadata ? formatCurrency(metadata.entradasTotaisGrupoMes) : "R$ 0,00"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Saldo Líquido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Resumo Financeiro
          </CardTitle>
          <CardDescription>Análise do seu saldo líquido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Saldo Líquido Total</p>
              <p
                className={`text-2xl font-bold ${
                  metadata && metadata.entradasTotais - metadata.gastoTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {metadata ? formatCurrency(metadata.entradasTotais - metadata.gastoTotal) : "R$ 0,00"}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Saldo do Mês</p>
              <p
                className={`text-2xl font-bold ${
                  metadata && metadata.entradasMes - metadata.gastoDoMes >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {metadata ? formatCurrency(metadata.entradasMes - metadata.gastoDoMes) : "R$ 0,00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
