"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "../../components/layout/dashboard-layout"
import { BarChart3, Users, FileText, Crown, UserIcon } from "lucide-react"
import { useAuth } from "../../context/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const isAdmin = user?.role === "ADMIN"

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant={isAdmin ? "default" : "secondary"} className="flex items-center space-x-1">
            {isAdmin ? <Crown className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
            <span>{user?.role}</span>
          </Badge>
        </div>
        <p className="text-muted-foreground">Bem-vindo, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,203</div>
            <p className="text-xs text-muted-foreground">+5% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+18% em relação ao mês passado</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Suas Permissões</CardTitle>
            <CardDescription>O que você pode fazer no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Visualizar dashboard</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Acessar perfil</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              {isAdmin && (
                <div className="flex items-center justify-between">
                  <span>Privilégios de administrador</span>
                  <Badge>✓ ADMIN</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
