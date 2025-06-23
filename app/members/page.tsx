"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { groupApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, LogOut, Mail } from "lucide-react"
import type { Membro } from "@/types/invites"
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
import { formatRole, formatDate } from "@/lib/utils"
import type { Role } from "@/types/auth"

export default function MembersPage() {
  const [membros, setMembros] = useState<Membro[]>([])
  const [loading, setLoading] = useState(true)
  const [quitting, setQuitting] = useState(false)
  const { refreshRole } = useAuth()
  const { toast } = useToast()

  const loadMembros = async () => {
    try {
      const response = await groupApi.getMembers()
      setMembros(response.data.membros)
    } catch (error) {
      toast({
        title: "Erro ao carregar membros",
        description: "Não foi possível carregar a lista de membros.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembros()
  }, [])

  const handleQuitGroup = async () => {
    setQuitting(true)
    try {
      await groupApi.quitGroup()
      await refreshRole()
      toast({
        title: "Você saiu do grupo",
        description: "Você foi removido do grupo financeiro.",
      })
    } catch (error) {
      toast({
        title: "Erro ao sair do grupo",
        description: "Não foi possível sair do grupo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setQuitting(false)
    }
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Membros do Grupo
          </h1>
          <p className="text-muted-foreground">Visualize todos os membros do seu grupo financeiro</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sair do Grupo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar saída do grupo</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair do grupo financeiro? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleQuitGroup}
                disabled={quitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {quitting ? "Saindo..." : "Sair do Grupo"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>
            {membros.length} {membros.length === 1 ? "membro" : "membros"} no grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membros.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum membro encontrado"
              description="Ainda não há membros cadastrados neste grupo."
            />
          ) : (
            <div className="space-y-4">
              {membros.map((membro) => (
                <div key={membro.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {membro.usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info.usuario.nome}{" "}
                        {membro.usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info.usuario.sobrenome}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {membro.usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info.email}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Membro desde {formatDate(membro.dthr_cadastro)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={membro.role === "ADMIN" ? "default" : "secondary"}>
                      {formatRole(membro.role as Role)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
