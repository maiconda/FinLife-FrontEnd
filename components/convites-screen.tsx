"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Clock, X, RefreshCw, AlertCircle, Building } from "lucide-react"
import { getUserInvites, acceptInvite, type ConviteItem } from "../lib/api"
import CreateOrganizationModal from "./create-organization-modal"

export default function ConvitesScreen() {
  const [invites, setInvites] = useState<ConviteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [acceptingInvites, setAcceptingInvites] = useState<Set<number>>(new Set())

  const fetchInvites = async () => {
    setIsLoading(true)
    setError("")

    try {
      const data = await getUserInvites()
      setInvites(data.convitesUsuario)
      console.log("Convites carregados:", data.convitesUsuario)
    } catch (error) {
      console.error("Erro ao carregar convites:", error)
      setError(error instanceof Error ? error.message : "Erro ao carregar convites")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptInvite = async (inviteId: number) => {
    setAcceptingInvites((prev) => new Set(prev).add(inviteId))

    try {
      const result = await acceptInvite(inviteId)
      console.log("Convite aceito:", result)

      // Atualizar a lista de convites
      await fetchInvites()

      // Mostrar mensagem de sucesso (opcional)
      // Você pode adicionar um toast ou notificação aqui
    } catch (error) {
      console.error("Erro ao aceitar convite:", error)
      setError(error instanceof Error ? error.message : "Erro ao aceitar convite")
    } finally {
      setAcceptingInvites((prev) => {
        const newSet = new Set(prev)
        newSet.delete(inviteId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const getStatusBadge = (invite: ConviteItem) => {
    if (invite.recusado) {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <X className="h-3 w-3" />
          <span>Recusado</span>
        </Badge>
      )
    }
    if (invite.pendente) {
      return (
        <Badge variant="outline" className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Pendente</span>
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="flex items-center space-x-1">
        <CheckCircle className="h-3 w-3" />
        <span>Aceito</span>
      </Badge>
    )
  }

  const getRoleBadge = (cargo: string) => {
    const roleColors = {
      ADMIN: "bg-red-100 text-red-800",
      MEMBRO: "bg-blue-100 text-blue-800",
      CONVIDADO: "bg-orange-100 text-orange-800",
    }

    return (
      <Badge className={roleColors[cargo as keyof typeof roleColors] || "bg-gray-100 text-gray-800"}>{cargo}</Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Convites</h1>
            <p className="text-gray-600 mt-1">Gerencie seus convites para organizações</p>
          </div>
          <Button onClick={fetchInvites} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Botão para criar organização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Criar Organização</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Não encontrou a organização que procura? Crie uma nova!</p>
          <CreateOrganizationModal onSuccess={fetchInvites} />
        </CardContent>
      </Card>

      {/* Mensagem de erro */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de convites */}
      {invites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum convite encontrado</h3>
            <p className="text-gray-600">Você não possui convites pendentes no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invites.map((invite) => (
            <Card key={invite.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Convite #{invite.id}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      {getRoleBadge(invite.cargo)}
                      {getStatusBadge(invite)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Grupo Financeiro</p>
                    <p className="text-base">#{invite.grupoFinanceiroId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Usuário Destino</p>
                    <p className="text-base">#{invite.usuarioDestinoId}</p>
                  </div>
                </div>

                {invite.pendente && !invite.recusado && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleAcceptInvite(invite.id)}
                      disabled={acceptingInvites.has(invite.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {acceptingInvites.has(invite.id) ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Aceitando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aceitar Convite
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {invite.recusado && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">Este convite foi recusado e não pode mais ser aceito.</p>
                  </div>
                )}

                {!invite.pendente && !invite.recusado && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">Este convite já foi aceito com sucesso.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
