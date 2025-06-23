"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { inviteApi, groupApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, X, Mail, Crown, UserCheck, Loader2 } from "lucide-react"
import type { Convite } from "@/types/invites"
import { EmptyState } from "@/components/empty-state"
import { formatRole } from "@/lib/utils"

export function ConvidadoDashboard() {
  const [convites, setConvites] = useState<Convite[]>([])
  const [nomeGrupo, setNomeGrupo] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingInvites, setLoadingInvites] = useState(true)
  const { refreshRole, user } = useAuth()
  const { toast } = useToast()

  const loadConvites = async () => {
    try {
      const response = await inviteApi.getReceivedInvites()
      setConvites(response.data.convitesUsuario)
    } catch (error) {
      console.error("Erro ao carregar convites:", error)
    } finally {
      setLoadingInvites(false)
    }
  }

  useEffect(() => {
    loadConvites()
  }, [])

  const handleAcceptInvite = async (id: number) => {
    try {
      await inviteApi.acceptInvite(id)
      await refreshRole()
      toast({
        title: "Convite aceito",
        description: "Você agora faz parte do grupo financeiro.",
      })
    } catch (error) {
      toast({
        title: "Erro ao aceitar convite",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineInvite = async (id: number) => {
    try {
      await inviteApi.declineInvite(id)
      setConvites((prev) => prev.filter((c) => c.id !== id))
      toast({
        title: "Convite recusado",
        description: "O convite foi recusado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao recusar convite",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await groupApi.createGroup({ nome: nomeGrupo })
      await refreshRole()
      toast({
        title: "Grupo criado com sucesso",
        description: "Você agora é administrador do grupo.",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar grupo",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Bem-vindo, {user?.user.nome}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Você ainda não faz parte de nenhum grupo financeiro. Aceite um convite ou crie seu próprio grupo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Convites Recebidos</CardTitle>
                <CardDescription>Convites para participar de grupos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingInvites ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : convites.length === 0 ? (
              <EmptyState
                icon={Mail}
                title="Nenhum convite recebido"
                description="Você ainda não recebeu convites para participar de grupos financeiros."
              />
            ) : (
              <div className="space-y-3">
                {convites.map((convite) => (
                  <div key={convite.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {
                            convite.membroId
                              .usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info.usuario.nome
                          }{" "}
                          {
                            convite.membroId
                              .usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info.usuario
                              .sobrenome
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {
                            convite.membroId
                              .usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info.email
                          }
                        </p>
                      </div>
                      <Badge variant={convite.cargo === "ADMIN" ? "default" : "secondary"}>
                        {convite.cargo === "ADMIN" ? (
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
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptInvite(convite.id)} className="flex-1">
                        <Check className="h-4 w-4 mr-1" />
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineInvite(convite.id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Recusar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Criar Grupo</CardTitle>
                <CardDescription>Crie seu próprio grupo financeiro</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeGrupo">Nome do Grupo</Label>
                <Input
                  id="nomeGrupo"
                  value={nomeGrupo}
                  onChange={(e) => setNomeGrupo(e.target.value)}
                  placeholder="Digite o nome do grupo"
                  required
                  className="h-11"
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Como administrador você poderá:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Convidar novos membros</li>
                  <li>• Gerenciar patrimônios do grupo</li>
                  <li>• Visualizar dados de todos os membros</li>
                </ul>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Grupo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
