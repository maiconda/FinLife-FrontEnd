"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { financeiroApi, patrimonioApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, TrendingDown, Plus, Trash2, Eye, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EmptyState } from "@/components/empty-state"
import { formatCurrency, formatDate } from "@/lib/utils"
import type {
  SaidaCategoria,
  TipoSaida,
  SaidaPrioridade,
  EntradaCategoria,
  TipoEntrada,
  CreateSaidaRequest,
  CreateEntradaRequest,
  Saida,
  Entrada,
} from "@/types/financeiro"
import type { Patrimonio } from "@/types/patrimonio"

export default function FinanceiroPage() {
  const { user, role } = useAuth()
  const { toast } = useToast()

  // Estados para dados
  const [saidasUsuario, setSaidasUsuario] = useState<Saida[]>([])
  const [entradasUsuario, setEntradasUsuario] = useState<Entrada[]>([])
  const [saidasGrupo, setSaidasGrupo] = useState<Saida[]>([])
  const [entradasGrupo, setEntradasGrupo] = useState<Entrada[]>([])
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])

  // Estados para formulários
  const [saidaCategorias, setSaidaCategorias] = useState<SaidaCategoria[]>([])
  const [saidaTipos, setSaidaTipos] = useState<TipoSaida[]>([])
  const [saidaPrioridades, setSaidaPrioridades] = useState<SaidaPrioridade[]>([])
  const [entradaCategorias, setEntradaCategorias] = useState<EntradaCategoria[]>([])
  const [entradaTipos, setEntradaTipos] = useState<TipoEntrada[]>([])

  // Estados de loading
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Estados de diálogos
  const [saidaDialogOpen, setSaidaDialogOpen] = useState(false)
  const [entradaDialogOpen, setEntradaDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Saida | Entrada | null>(null)

  // Estados dos formulários
  const [saidaForm, setSaidaForm] = useState<CreateSaidaRequest>({
    nome: "",
    dthr_saida: null,
    id_saida_categoria: 0,
    id_pagamento_saida_tipo: 0,
    id_saida_prioridade: 0,
    id_usuario_info: user?.userInfo.id || 0,
    id_periodicidade: 0,
    valor: 0,
    id_patrimonio_info: null,
  })

  const [entradaForm, setEntradaForm] = useState<CreateEntradaRequest>({
    nome: "",
    dthr_entrada: null,
    id_entrada_categoria: 0,
    id_pagamento_entrada_tipo: 0,
    id_usuario_info: user?.userInfo.id || 0,
    id_periodicidade: 0,
    valor: "",
    id_patrimonio_info: null,
    comprovante: 0,
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
    loadFormData()
  }, [role])

  const loadData = async () => {
    try {
      if (role === "ADMIN") {
        // Admin sempre faz as 4 buscas
        const [saidasUsuarioRes, entradasUsuarioRes, saidasGrupoRes, entradasGrupoRes, patrimoniosRes] =
          await Promise.all([
            financeiroApi.getSaidas(),
            financeiroApi.getEntradas(),
            financeiroApi.getSaidasGrupo(),
            financeiroApi.getEntradasGrupo(),
            patrimonioApi.getOwn(),
          ])

        console.log("Saídas do usuário:", saidasUsuarioRes.data)
        console.log("Entradas do usuário:", entradasUsuarioRes.data)
        console.log("Saídas do grupo - estrutura completa:", JSON.stringify(saidasGrupoRes.data, null, 2))
        console.log("Entradas do grupo - estrutura completa:", JSON.stringify(entradasGrupoRes.data, null, 2))

        setSaidasUsuario(Array.isArray(saidasUsuarioRes.data.saidas) ? saidasUsuarioRes.data.saidas : [])
        setEntradasUsuario(Array.isArray(entradasUsuarioRes.data.entradas) ? entradasUsuarioRes.data.entradas : [])
        setSaidasGrupo(Array.isArray(saidasGrupoRes.data.saidas) ? saidasGrupoRes.data.saidas : [])
        setEntradasGrupo(Array.isArray(entradasGrupoRes.data.entradas) ? entradasGrupoRes.data.entradas : [])
        setPatrimonios(Array.isArray(patrimoniosRes.data.patrimonios) ? patrimoniosRes.data.patrimonios : [])
      } else {
        // Membro só faz as buscas do usuário
        const [saidasRes, entradasRes, patrimoniosRes] = await Promise.all([
          financeiroApi.getSaidas(),
          financeiroApi.getEntradas(),
          patrimonioApi.getOwn(),
        ])

        console.log("Saídas do usuário:", saidasRes.data)
        console.log("Entradas do usuário:", entradasRes.data)

        setSaidasUsuario(Array.isArray(saidasRes.data.saidas) ? saidasRes.data.saidas : [])
        setEntradasUsuario(Array.isArray(entradasRes.data.entradas) ? entradasRes.data.entradas : [])
        setPatrimonios(Array.isArray(patrimoniosRes.data.patrimonios) ? patrimoniosRes.data.patrimonios : [])
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setSaidasUsuario([])
      setEntradasUsuario([])
      setSaidasGrupo([])
      setEntradasGrupo([])
      setPatrimonios([])

      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados financeiros.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadFormData = async () => {
    try {
      const [saidaCategoriasRes, saidaTiposRes, saidaPrioridadesRes, entradaCategoriasRes, entradaTiposRes] =
        await Promise.all([
          financeiroApi.getSaidaCategorias(),
          financeiroApi.getSaidaTipos(),
          financeiroApi.getSaidaPrioridades(),
          financeiroApi.getEntradaCategorias(),
          financeiroApi.getEntradaTipos(),
        ])

      console.log("Prioridades de saída:", saidaPrioridadesRes.data)

      // Use categoriasPadrao instead of direct array
      setSaidaCategorias(
        Array.isArray(saidaCategoriasRes.data.categoriasPadrao) ? saidaCategoriasRes.data.categoriasPadrao : [],
      )
      setSaidaTipos(Array.isArray(saidaTiposRes.data.tiposPublicos) ? saidaTiposRes.data.tiposPublicos : [])
      // Use saidasPublicas instead of saidas
      setSaidaPrioridades(
        Array.isArray(saidaPrioridadesRes.data.saidasPublicas) ? saidaPrioridadesRes.data.saidasPublicas : [],
      )
      setEntradaCategorias(
        Array.isArray(entradaCategoriasRes.data.entradasCategoriasPadrao)
          ? entradaCategoriasRes.data.entradasCategoriasPadrao
          : [],
      )
      setEntradaTipos(Array.isArray(entradaTiposRes.data.tiposPublicos) ? entradaTiposRes.data.tiposPublicos : [])
    } catch (error) {
      console.error("Erro ao carregar dados do formulário:", error)
      // Set empty arrays as fallback
      setSaidaCategorias([])
      setSaidaTipos([])
      setSaidaPrioridades([])
      setEntradaCategorias([])
      setEntradaTipos([])

      toast({
        title: "Erro ao carregar formulários",
        description: "Alguns campos podem não estar disponíveis.",
        variant: "destructive",
      })
    }
  }

  const handleCreateSaida = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      await financeiroApi.createSaida({
        ...saidaForm,
        id_usuario_info: user?.userInfo.id || 0,
        dthr_saida: null,
      })

      setSaidaForm({
        nome: "",
        dthr_saida: null,
        id_saida_categoria: 0,
        id_pagamento_saida_tipo: 0,
        id_saida_prioridade: 0,
        id_usuario_info: user?.userInfo.id || 0,
        id_periodicidade: 0,
        valor: 0,
        id_patrimonio_info: null,
      })
      setSaidaDialogOpen(false)
      await loadData()

      toast({
        title: "Saída criada!",
        description: "A saída foi registrada com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar saída",
        description: error.response?.data?.message || "Não foi possível criar a saída.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleCreateEntrada = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      await financeiroApi.createEntrada({
        ...entradaForm,
        id_usuario_info: user?.userInfo.id || 0,
        dthr_entrada: null,
      })

      setEntradaForm({
        nome: "",
        dthr_entrada: null,
        id_entrada_categoria: 0,
        id_pagamento_entrada_tipo: 0,
        id_usuario_info: user?.userInfo.id || 0,
        id_periodicidade: 0,
        valor: "",
        id_patrimonio_info: null,
        comprovante: 0,
      })
      setEntradaDialogOpen(false)
      await loadData()

      toast({
        title: "Entrada criada!",
        description: "A entrada foi registrada com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar entrada",
        description: error.response?.data?.message || "Não foi possível criar a entrada.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteSaida = async (id: number) => {
    try {
      await financeiroApi.deleteSaida(id)
      setSaidasUsuario((prev) => prev.filter((s) => s.id !== id))
      setSaidasGrupo((prev) => prev.filter((s) => s.id !== id))
      toast({
        title: "Saída excluída",
        description: "A saída foi removida com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir saída",
        description: "Não foi possível excluir a saída.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEntrada = async (id: number) => {
    try {
      await financeiroApi.deleteEntrada(id)
      setEntradasUsuario((prev) => prev.filter((e) => e.id !== id))
      setEntradasGrupo((prev) => prev.filter((e) => e.id !== id))
      toast({
        title: "Entrada excluída",
        description: "A entrada foi removida com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir entrada",
        description: "Não foi possível excluir a entrada.",
        variant: "destructive",
      })
    }
  }

  const openDetailDialog = (item: Saida | Entrada) => {
    setSelectedItem(item)
    setDetailDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Controle Financeiro</h1>
          <p className="text-muted-foreground">Gerencie suas entradas e saídas financeiras</p>
        </div>
      </div>

      <Tabs defaultValue="saidas" className="w-full">
        <TabsList className={`grid w-full ${role === "ADMIN" ? "grid-cols-3" : "grid-cols-2"}`}>
          <TabsTrigger value="saidas" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Saídas
          </TabsTrigger>
          <TabsTrigger value="entradas" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Entradas
          </TabsTrigger>
          {role === "ADMIN" && (
            <TabsTrigger value="grupo" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Grupo
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="saidas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Minhas Saídas
                  </CardTitle>
                  <CardDescription>
                    {saidasUsuario.length} {saidasUsuario.length === 1 ? "saída registrada" : "saídas registradas"}
                  </CardDescription>
                </div>
                <Dialog open={saidaDialogOpen} onOpenChange={setSaidaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Nova Saída
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Nova Saída</DialogTitle>
                      <DialogDescription>Adicione uma nova saída ao seu controle financeiro</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSaida} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-saida">Nome da Saída</Label>
                        <Input
                          id="nome-saida"
                          value={saidaForm.nome}
                          onChange={(e) => setSaidaForm((prev) => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: Supermercado, Combustível..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoria-saida">Categoria</Label>
                          <Select
                            value={saidaForm.id_saida_categoria.toString()}
                            onValueChange={(value) =>
                              setSaidaForm((prev) => ({ ...prev, id_saida_categoria: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {saidaCategorias.length > 0 ? (
                                saidaCategorias.map((categoria) => (
                                  <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                    {categoria.nome}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  Carregando categorias...
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tipo-saida">Tipo de Pagamento</Label>
                          <Select
                            value={saidaForm.id_pagamento_saida_tipo.toString()}
                            onValueChange={(value) =>
                              setSaidaForm((prev) => ({ ...prev, id_pagamento_saida_tipo: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {saidaTipos.length > 0 ? (
                                saidaTipos.map((tipo) => (
                                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                    {tipo.nome}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">Carregando tipos...</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prioridade-saida">Prioridade</Label>
                          <Select
                            value={saidaForm.id_saida_prioridade.toString()}
                            onValueChange={(value) =>
                              setSaidaForm((prev) => ({ ...prev, id_saida_prioridade: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                              {saidaPrioridades.length > 0 ? (
                                saidaPrioridades.map((prioridade) => (
                                  <SelectItem key={prioridade.id} value={prioridade.id.toString()}>
                                    {prioridade.nome} (Nível {prioridade.nivel})
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  Carregando prioridades...
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valor-saida">Valor (R$)</Label>
                          <Input
                            id="valor-saida"
                            type="number"
                            step="0.01"
                            min="0"
                            value={saidaForm.valor}
                            onChange={(e) =>
                              setSaidaForm((prev) => ({ ...prev, valor: Number.parseFloat(e.target.value) || 0 }))
                            }
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patrimonio-saida">Patrimônio (Opcional)</Label>
                        <Select
                          value={saidaForm.id_patrimonio_info?.toString() || "0"}
                          onValueChange={(value) =>
                            setSaidaForm((prev) => ({
                              ...prev,
                              id_patrimonio_info: value ? Number.parseInt(value) : null,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um patrimônio (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Nenhum patrimônio</SelectItem>
                            {patrimonios.length > 0 ? (
                              patrimonios.map((patrimonio) => (
                                <SelectItem key={patrimonio.id} value={patrimonio.id.toString()}>
                                  {patrimonio.patrimonio.nome}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">Carregando patrimônios...</div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={creating} className="flex-1">
                          {creating ? "Criando..." : "Criar Saída"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setSaidaDialogOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {saidasUsuario.length === 0 ? (
                <EmptyState
                  icon={TrendingDown}
                  title="Nenhuma saída registrada"
                  description="Comece registrando sua primeira saída financeira."
                  action={
                    <Button onClick={() => setSaidaDialogOpen(true)} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Saída
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {saidasUsuario.map((saida) => (
                    <div key={saida.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{saida.saida?.nome || `Saída #${saida.id}`}</h3>
                          <Badge variant="destructive">{formatCurrency(saida.valor)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(saida.dthr_cadastro)}
                          {role === "ADMIN" && saida.usuario_info_saida_info_id_usuario_info_cadastroTousuario_info && (
                            <span>
                              {" "}
                              • {saida.usuario_info_saida_info_id_usuario_info_cadastroTousuario_info.usuario.nome}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDetailDialog(saida)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a saída "{saida.saida?.nome || `Saída #${saida.id}`}"?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSaida(saida.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entradas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Minhas Entradas
                  </CardTitle>
                  <CardDescription>
                    {entradasUsuario.length}{" "}
                    {entradasUsuario.length === 1 ? "entrada registrada" : "entradas registradas"}
                  </CardDescription>
                </div>
                <Dialog open={entradaDialogOpen} onOpenChange={setEntradaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Nova Entrada
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Nova Entrada</DialogTitle>
                      <DialogDescription>Adicione uma nova entrada ao seu controle financeiro</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateEntrada} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome-entrada">Nome da Entrada</Label>
                        <Input
                          id="nome-entrada"
                          value={entradaForm.nome}
                          onChange={(e) => setEntradaForm((prev) => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: Salário, Freelance..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoria-entrada">Categoria</Label>
                          <Select
                            value={entradaForm.id_entrada_categoria.toString()}
                            onValueChange={(value) =>
                              setEntradaForm((prev) => ({ ...prev, id_entrada_categoria: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {entradaCategorias.length > 0 ? (
                                entradaCategorias.map((categoria) => (
                                  <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                    {categoria.nome}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  Carregando categorias...
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tipo-entrada">Tipo de Pagamento</Label>
                          <Select
                            value={entradaForm.id_pagamento_entrada_tipo.toString()}
                            onValueChange={(value) =>
                              setEntradaForm((prev) => ({ ...prev, id_pagamento_entrada_tipo: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {entradaTipos.length > 0 ? (
                                entradaTipos.map((tipo) => (
                                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                    {tipo.nome}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">Carregando tipos...</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valor-entrada">Valor (R$)</Label>
                          <Input
                            id="valor-entrada"
                            type="number"
                            step="0.01"
                            min="0"
                            value={entradaForm.valor}
                            onChange={(e) => setEntradaForm((prev) => ({ ...prev, valor: e.target.value }))}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patrimonio-entrada">Patrimônio (Opcional)</Label>
                          <Select
                            value={entradaForm.id_patrimonio_info?.toString() || "0"}
                            onValueChange={(value) =>
                              setEntradaForm((prev) => ({
                                ...prev,
                                id_patrimonio_info: value ? Number.parseInt(value) : null,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um patrimônio (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Nenhum patrimônio</SelectItem>
                              {patrimonios.length > 0 ? (
                                patrimonios.map((patrimonio) => (
                                  <SelectItem key={patrimonio.id} value={patrimonio.id.toString()}>
                                    {patrimonio.patrimonio.nome}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  Carregando patrimônios...
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={creating} className="flex-1">
                          {creating ? "Criando..." : "Criar Entrada"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEntradaDialogOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {entradasUsuario.length === 0 ? (
                <EmptyState
                  icon={TrendingUp}
                  title="Nenhuma entrada registrada"
                  description="Comece registrando sua primeira entrada financeira."
                  action={
                    <Button onClick={() => setEntradaDialogOpen(true)} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Entrada
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {entradasUsuario.map((entrada) => (
                    <div key={entrada.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{entrada.entrada?.nome || `Entrada #${entrada.id}`}</h3>
                          <Badge variant="default" className="bg-green-600">
                            {formatCurrency(entrada.valor)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(entrada.dthr_cadastro)}
                          {role === "ADMIN" &&
                            entrada.usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info && (
                              <span>
                                {" "}
                                •{" "}
                                {entrada.usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info.usuario.nome}
                              </span>
                            )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDetailDialog(entrada)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a entrada "
                                {entrada.entrada?.nome || `Entrada #${entrada.id}`}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEntrada(entrada.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {role === "ADMIN" && (
          <TabsContent value="grupo" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Saídas do Grupo
                  </CardTitle>
                  <CardDescription>Todas as saídas registradas pelos membros do grupo</CardDescription>
                </CardHeader>
                <CardContent>
                  {saidasGrupo.length === 0 ? (
                    <EmptyState
                      icon={TrendingDown}
                      title="Nenhuma saída no grupo"
                      description="Ainda não há saídas registradas pelos membros."
                    />
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {saidasGrupo.map((saida) => (
                        <div key={saida.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{saida.saida?.nome || `Saída #${saida.id}`}</h4>
                              <Badge variant="destructive" className="text-xs">
                                {formatCurrency(saida.valor)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(saida.dthr_cadastro)}
                              {saida.usuario_info_saida_info_id_usuario_info_cadastroTousuario_info && (
                                <span>
                                  {" "}
                                  • {saida.usuario_info_saida_info_id_usuario_info_cadastroTousuario_info.usuario.nome}
                                </span>
                              )}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => openDetailDialog(saida)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Entradas do Grupo
                  </CardTitle>
                  <CardDescription>Todas as entradas registradas pelos membros do grupo</CardDescription>
                </CardHeader>
                <CardContent>
                  {entradasGrupo.length === 0 ? (
                    <EmptyState
                      icon={TrendingUp}
                      title="Nenhuma entrada no grupo"
                      description="Ainda não há entradas registradas pelos membros."
                    />
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {entradasGrupo.map((entrada) => (
                        <div key={entrada.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {entrada.entrada?.nome || `Entrada #${entrada.id}`}
                              </h4>
                              <Badge variant="default" className="bg-green-600 text-xs">
                                {formatCurrency(entrada.valor)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(entrada.dthr_cadastro)}
                              {entrada.usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info && (
                                <span>
                                  {" "}
                                  •{" "}
                                  {
                                    entrada.usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info.usuario
                                      .nome
                                  }
                                </span>
                              )}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => openDetailDialog(entrada)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Dialog de detalhes */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"saida" in (selectedItem || {}) ? "Detalhes da Saída" : "Detalhes da Entrada"}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="text-sm">
                    {"saida" in selectedItem
                      ? selectedItem.saida?.nome || `Saída #${selectedItem.id}`
                      : selectedItem.entrada?.nome || `Entrada #${selectedItem.id}`}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor</Label>
                  <p className="text-sm font-bold">{formatCurrency(selectedItem.valor)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Data de Cadastro</Label>
                  <p className="text-sm">{formatDate(selectedItem.dthr_cadastro)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedItem.id_ativo ? "default" : "secondary"}>
                    {selectedItem.id_ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              {role === "ADMIN" && (
                <div>
                  <Label className="text-sm font-medium">Usuário</Label>
                  <p className="text-sm">
                    {"saida" in selectedItem &&
                    selectedItem.usuario_info_saida_info_id_usuario_info_cadastroTousuario_info
                      ? selectedItem.usuario_info_saida_info_id_usuario_info_cadastroTousuario_info.usuario.nome
                      : "entrada" in selectedItem &&
                          selectedItem.usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info
                        ? selectedItem.usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info.usuario.nome
                        : "N/A"}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
