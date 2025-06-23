"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { inviteApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Mail, Trash2, Send } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ConviteEnviado } from "@/types/invites"
import { EmptyState } from "@/components/empty-state"
import { formatRole } from "@/lib/utils"
import type { Role } from "@/types/auth"

export default function InvitesPage() {
  const [convites, setConvites] = useState<ConviteEnviado[]>([])
  const [email, setEmail] = useState("")
  const [cargo, setCargo] = useState<"ADMIN" | "MEMBRO">("MEMBRO")
  const [loading, setLoading] = useState(false)
  const [loadingInvites, setLoadingInvites] = useState(true)
  const { toast } = useToast()

  const loadConvites = async () => {
    try {
      const response = await inviteApi.getSentInvites()
      setConvites(response.data.convites)
    } catch (error) {
      toast({
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar os convites enviados.",
        variant: "destructive",
      })
    } finally {
      setLoadingInvites(false)
    }
  }

  useEffect(() => {
    loadConvites()
  }, [])

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await inviteApi.sendInvite({
        cargo,
        usuarioDestinoEmail: email,
      })

      setEmail("")
      setCargo("MEMBRO")
      await loadConvites()

      toast({
        title: "Convite enviado!",
        description: `Convite para ${cargo} enviado para ${email}.`,
      })
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error.response?.data?.message || "Não foi possível enviar o convite.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveInvite = async (id: number) => {
    try {
      await inviteApi.removeInvite(id)
      setConvites((prev) => prev.filter((c) => c.id !== id))
      toast({
        title: "Convite removido",
        description: "O convite foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover convite",
        description: "Não foi possível remover o convite.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (convite: ConviteEnviado) => {
    if (convite.recusado) {
      return <Badge variant="destructive">Recusado</Badge>
    }
    if (convite.pendente) {
      return <Badge variant="outline">Pendente</Badge>
    }
    return <Badge variant="default">Aceito</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserPlus className="h-8 w-8" />
          Gerenciar Convites
        </h1>
        <p className="text-muted-foreground">Convide novos membros para o seu grupo financeiro</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Convite
            </CardTitle>
            <CardDescription>Convide um usuário pelo email para participar do grupo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email do usuário</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo">Função no grupo</Label>
                <Select value={cargo} onValueChange={(value: "ADMIN" | "MEMBRO") => setCargo(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBRO">Membro</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Convite"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Convites Enviados
            </CardTitle>
            <CardDescription>Lista de todos os convites enviados</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingInvites ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : convites.length === 0 ? (
              <EmptyState
                icon={Mail}
                title="Nenhum convite enviado"
                description="Você ainda não enviou convites para este grupo."
              />
            ) : (
              <div className="space-y-4">
                {convites.map((convite) => (
                  <div key={convite.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{convite.usuario.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Convidado por:{" "}
                          {
                            convite.membroId
                              .usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info.usuario.nome
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={convite.cargo === "ADMIN" ? "default" : "secondary"}>
                          {formatRole(convite.cargo as Role)}
                        </Badge>
                        {getStatusBadge(convite)}
                      </div>
                    </div>
                    {convite.pendente && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveInvite(convite.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover Convite
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
