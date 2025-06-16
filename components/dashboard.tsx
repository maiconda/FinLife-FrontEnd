"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, BarChart3, FileText, Shield, LogOut, Crown, User } from "lucide-react"
import { useAuth } from "../context/auth-context"

export default function Dashboard() {
  const { user, logout } = useAuth()

  const isAdmin = user?.role === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Badge variant={isAdmin ? "default" : "secondary"} className="flex items-center space-x-1">
                {isAdmin ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
                <span>{user?.role}</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card para todos os usuários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Documentos</span>
              </CardTitle>
              <CardDescription>Acesse seus documentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ver Documentos</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Relatórios</span>
              </CardTitle>
              <CardDescription>Visualize relatórios básicos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ver Relatórios</Button>
            </CardContent>
          </Card>

          {/* Cards exclusivos para Admin */}
          {isAdmin && (
            <>
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Users className="w-5 h-5" />
                    <span>Gerenciar Usuários</span>
                    <Badge variant="secondary" className="ml-auto">
                      Admin
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-blue-700">Gerencie usuários e permissões</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Gerenciar Usuários</Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Settings className="w-5 h-5" />
                    <span>Configurações</span>
                    <Badge variant="secondary" className="ml-auto">
                      Admin
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-blue-700">Configurações do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Configurar Sistema</Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Shield className="w-5 h-5" />
                    <span>Segurança</span>
                    <Badge variant="secondary" className="ml-auto">
                      Admin
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-blue-700">Logs e auditoria do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Logs</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Informações sobre permissões */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Suas Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Visualizar documentos</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Gerar relatórios</span>
                <Badge variant="secondary">✓</Badge>
              </div>
              {isAdmin && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Gerenciar usuários</span>
                    <Badge>✓ Admin</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Configurações do sistema</span>
                    <Badge>✓ Admin</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Logs de segurança</span>
                    <Badge>✓ Admin</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
