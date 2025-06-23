"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { patrimonioApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"
import type { PatrimonioDetalhado } from "@/types/patrimonio"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function PatrimonioDetailPage() {
  const [patrimonio, setPatrimonio] = useState<PatrimonioDetalhado | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const loadPatrimonio = async () => {
    try {
      const response = await patrimonioApi.getById(Number(params.id))
      setPatrimonio(response.data.patrimonios)
    } catch (error) {
      toast({
        title: "Erro ao carregar patrimônio",
        description: "Não foi possível carregar os detalhes do patrimônio.",
        variant: "destructive",
      })
      router.push("/patrimonio")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      loadPatrimonio()
    }
  }, [params.id])

  const calculateTotalEntradas = () => {
    if (!patrimonio?.entrada_info) return 0
    return patrimonio.entrada_info
      .filter((entrada) => entrada.id_ativo)
      .reduce((total, entrada) => total + Number.parseFloat(entrada.valor), 0)
  }

  const calculateTotalSaidas = () => {
    if (!patrimonio?.saida_info) return 0
    return patrimonio.saida_info
      .filter((saida) => saida.id_ativo)
      .reduce((total, saida) => total + Number.parseFloat(saida.valor), 0)
  }

  const calculateVariacao = () => {
    if (!patrimonio) return 0
    const valorAquisicao = Number.parseFloat(patrimonio.patrimonio.valor_aquisicao)
    const valorMercado = Number.parseFloat(patrimonio.valor_mercado)
    return ((valorMercado - valorAquisicao) / valorAquisicao) * 100
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!patrimonio) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Patrimônio não encontrado</p>
      </div>
    )
  }

  const variacao = calculateVariacao()
  const totalEntradas = calculateTotalEntradas()
  const totalSaidas = calculateTotalSaidas()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{patrimonio.patrimonio.nome}</h1>
          <p className="text-muted-foreground">Cadastrado em {formatDate(patrimonio.dthr_cadastro)}</p>
        </div>
        <Badge variant={patrimonio.id_ativo ? "default" : "secondary"}>
          {patrimonio.id_ativo ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor de Aquisição</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(patrimonio.patrimonio.valor_aquisicao)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor de Mercado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(patrimonio.valor_mercado)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação</CardTitle>
            {variacao >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${variacao >= 0 ? "text-green-600" : "text-red-600"}`}>
              {variacao >= 0 ? "+" : ""}
              {variacao.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency((totalEntradas - totalSaidas).toString())}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Entradas
            </CardTitle>
            <CardDescription>Fluxo de entrada de recursos</CardDescription>
          </CardHeader>
          <CardContent>
            {patrimonio.entrada_info.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhuma entrada registrada</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center font-medium">
                  <span>Total de Entradas:</span>
                  <span className="text-green-600">{formatCurrency(totalEntradas.toString())}</span>
                </div>
                <div className="space-y-2">
                  {patrimonio.entrada_info
                    .filter((entrada) => entrada.id_ativo)
                    .map((entrada, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded"
                      >
                        <span className="text-sm">Periodicidade: {entrada.id_periodicidade}</span>
                        <span className="font-medium text-green-600">{formatCurrency(entrada.valor)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              Saídas
            </CardTitle>
            <CardDescription>Fluxo de saída de recursos</CardDescription>
          </CardHeader>
          <CardContent>
            {patrimonio.saida_info.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhuma saída registrada</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center font-medium">
                  <span>Total de Saídas:</span>
                  <span className="text-red-600">{formatCurrency(totalSaidas.toString())}</span>
                </div>
                <div className="space-y-2">
                  {patrimonio.saida_info
                    .filter((saida) => saida.id_ativo)
                    .map((saida, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950 rounded"
                      >
                        <span className="text-sm">Periodicidade: {saida.id_periodicidade}</span>
                        <span className="font-medium text-red-600">{formatCurrency(saida.valor)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Análise geral do patrimônio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Rentabilidade</p>
              <p className={`text-2xl font-bold ${variacao >= 0 ? "text-green-600" : "text-red-600"}`}>
                {variacao >= 0 ? "+" : ""}
                {variacao.toFixed(2)}%
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Fluxo Líquido</p>
              <p
                className={`text-2xl font-bold ${(totalEntradas - totalSaidas) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency((totalEntradas - totalSaidas).toString())}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
