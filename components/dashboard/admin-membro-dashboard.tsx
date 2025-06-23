"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, UserPlus, Crown, UserCheck, Settings } from "lucide-react"
import { formatRole } from "@/lib/utils"

export function AdminMembroDashboard() {
  const { user, role } = useAuth()

  const features = [
    {
      icon: Users,
      title: "Gerenciar Membros",
      description: "Visualize e gerencie os membros do grupo",
      available: true,
    },
    ...(role === "ADMIN"
      ? [
          {
            icon: UserPlus,
            title: "Enviar Convites",
            description: "Convide novos membros para o grupo",
            available: true,
          },
        ]
      : []),
    {
      icon: DollarSign,
      title: "Patrimônios",
      description: "Gerencie patrimônios financeiros",
      available: true,
    },
    {
      icon: Settings,
      title: "Configurações",
      description: "Configurações do grupo e preferências",
      available: false,
    },
  ]

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

      <Card>
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Sistema em Desenvolvimento</CardTitle>
          <CardDescription>Estamos trabalhando para trazer as melhores funcionalidades</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="text-center p-6 border rounded-lg space-y-3 hover:shadow-sm transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Badge variant={feature.available ? "default" : "secondary"} className="text-xs">
                    {feature.available ? "Disponível" : "Em breve"}
                  </Badge>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Próximas funcionalidades</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Dashboard com gráficos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Relatórios financeiros</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Metas financeiras</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Notificações</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
