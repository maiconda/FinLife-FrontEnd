"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { patrimonioApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Plus, Trash2, Eye, Users, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Patrimonio, CreatePatrimonioRequest } from "@/types/patrimonio"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/empty-state"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function PatrimonioPage() {
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([])
  const [patrimoniosGrupo, setPatrimoniosGrupo] = useState<Patrimonio[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingGrupo, setLoadingGrupo] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPatrimonio, setEditingPatrimonio] = useState<Patrimonio | null>(null)
  const [formData, setFormData] = useState<CreatePatrimonioRequest>({
    nome: "",
    valor_aquisicao: 0,
    valor_mercado: 0,
  })
  const [editFormData, setEditFormData] = useState<CreatePatrimonioRequest>({
    nome: "",
    valor_aquisicao: 0,
    valor_mercado: 0,
  })
  const { role } = useAuth()
  const { toast } = useToast()

  const loadPatrimonios = async () => {
    try {
      const response = await patrimonioApi.getOwn()
      setPatrimonios(response.data.patrimonios)
    } catch (error) {
      toast({
        title: "Erro ao carregar patrimônios",
        description: "Não foi possível carregar seus patrimônios.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPatrimoniosGrupo = async () => {
    if (role !== "ADMIN") {
      setLoadingGrupo(false)
      return
    }

    try {
      const response = await patrimonioApi.getGroupPatrimonios()
      setPatrimoniosGrupo(response.data.patrimonios)
    } catch (error) {
      console.error("Erro ao carregar patrimônios do grupo:", error)
    } finally {
      setLoadingGrupo(false)
    }
  }

  useEffect(() => {
    loadPatrimonios()
    loadPatrimoniosGrupo()
  }, [role])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("valor") ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: name.includes("valor") ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      await patrimonioApi.create(formData)
      setFormData({ nome: "", valor_aquisicao: 0, valor_mercado: 0 })
      setDialogOpen(false)
      await loadPatrimonios()
      if (role === "ADMIN") {
        await loadPatrimoniosGrupo()
      }
      toast({
        title: "Patrimônio criado!",
        description: "Seu patrimônio foi cadastrado com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar patrimônio",
        description: error.response?.data?.message || "Não foi possível criar o patrimônio.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleEdit = (patrimonio: Patrimonio) => {
    setEditingPatrimonio(patrimonio)
    setEditFormData({
      nome: patrimonio.patrimonio.nome,
      valor_aquisicao: Number.parseFloat(patrimonio.patrimonio.valor_aquisicao),
      valor_mercado: Number.parseFloat(patrimonio.valor_mercado),
    })
    setEditDialogOpen(true)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPatrimonio) return

    setCreating(true)
    try {
      await patrimonioApi.update(editingPatrimonio.id, editFormData)
      setEditDialogOpen(false)
      await loadPatrimonios()
      if (role === "ADMIN") {
        await loadPatrimoniosGrupo()
      }
      toast({
        title: "Patrimônio atualizado!",
        description: "As alterações foram salvas com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar patrimônio",
        description: error.response?.data?.message || "Não foi possível atualizar o patrimônio.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await patrimonioApi.delete(id)
      setPatrimonios((prev) => prev.filter((p) => p.id !== id))
      toast({
        title: "Patrimônio excluído",
        description: "O patrimônio foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir patrimônio",
        description: "Não foi possível excluir o patrimônio.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Patrimônios
          </h1>
          <p className="text-muted-foreground">Gerencie seus patrimônios financeiros</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Patrimônio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Patrimônio</DialogTitle>
              <DialogDescription>Adicione um novo patrimônio ao seu portfólio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Patrimônio</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Casa, Carro, Investimento..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_aquisicao">Valor de Aquisição (R$)</Label>
                <Input
                  id="valor_aquisicao"
                  name="valor_aquisicao"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_aquisicao}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_mercado">Valor de Mercado (R$)</Label>
                <Input
                  id="valor_mercado"
                  name="valor_mercado"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_mercado}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} className="flex-1">
                  {creating ? "Criando..." : "Criar Patrimônio"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog de Edição */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Patrimônio</DialogTitle>
              <DialogDescription>Atualize as informações do seu patrimônio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome do Patrimônio</Label>
                <Input
                  id="edit-nome"
                  name="nome"
                  value={editFormData.nome}
                  onChange={handleEditChange}
                  placeholder="Ex: Casa, Carro, Investimento..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-valor_aquisicao">Valor de Aquisição (R$)</Label>
                <Input
                  id="edit-valor_aquisicao"
                  name="valor_aquisicao"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editFormData.valor_aquisicao}
                  onChange={handleEditChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-valor_mercado">Valor de Mercado (R$)</Label>
                <Input
                  id="edit-valor_mercado"
                  name="valor_mercado"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editFormData.valor_mercado}
                  onChange={handleEditChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating} className="flex-1">
                  {creating ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="meus" className="w-full">
        <TabsList>
          <TabsTrigger value="meus">Meus Patrimônios</TabsTrigger>
          {role === "ADMIN" && <TabsTrigger value="grupo">Patrimônios do Grupo</TabsTrigger>}
        </TabsList>

        <TabsContent value="meus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meus Patrimônios</CardTitle>
              <CardDescription>
                {patrimonios.length} {patrimonios.length === 1 ? "patrimônio cadastrado" : "patrimônios cadastrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : patrimonios.length === 0 ? (
                <EmptyState
                  icon={DollarSign}
                  title="Nenhum patrimônio cadastrado"
                  description="Comece adicionando seu primeiro patrimônio ao portfólio."
                  action={
                    <Button onClick={() => setDialogOpen(true)} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Patrimônio
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patrimonios.map((patrimonio) => (
                    <Card key={patrimonio.id} className="relative">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{patrimonio.patrimonio.nome}</CardTitle>
                        <Badge variant="outline" className="w-fit">
                          {patrimonio.id_ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Valor de Aquisição</p>
                          <p className="font-medium">{formatCurrency(patrimonio.patrimonio.valor_aquisicao)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor de Mercado</p>
                          <p className="font-medium">{formatCurrency(patrimonio.valor_mercado)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cadastrado em</p>
                          <p className="text-sm">{formatDate(patrimonio.dthr_cadastro)}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button asChild size="sm" variant="outline" className="flex-1">
                            <Link href={`/patrimonio/${patrimonio.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Link>
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleEdit(patrimonio)}>
                            <Edit className="h-4 w-4" />
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
                                  Tem certeza que deseja excluir o patrimônio "{patrimonio.patrimonio.nome}"? Esta ação
                                  não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(patrimonio.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {role === "ADMIN" && (
          <TabsContent value="grupo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patrimônios do Grupo
                </CardTitle>
                <CardDescription>Visualize todos os patrimônios dos membros do grupo</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingGrupo ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : patrimoniosGrupo.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="Nenhum patrimônio no grupo"
                    description="Ainda não há patrimônios cadastrados pelos membros do grupo."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patrimoniosGrupo.map((patrimonio) => (
                      <Card key={patrimonio.id} className="relative">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{patrimonio.patrimonio.nome}</CardTitle>
                          <Badge variant="secondary" className="w-fit mb-2">
                            {patrimonio.usuario_info
                              ? `${patrimonio.usuario_info.usuario.nome} - ${patrimonio.usuario_info.email}`
                              : "Patrimônio do Grupo"}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Valor de Aquisição</p>
                            <p className="font-medium">{formatCurrency(patrimonio.patrimonio.valor_aquisicao)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Valor de Mercado</p>
                            <p className="font-medium">{formatCurrency(patrimonio.valor_mercado)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cadastrado em</p>
                            <p className="text-sm">{formatDate(patrimonio.dthr_cadastro)}</p>
                          </div>
                          <Badge variant="outline" className="w-fit">
                            {patrimonio.id_ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
