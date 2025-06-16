"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import DashboardLayout from "../../../components/layout/dashboard-layout"
import { useAuth } from "../../../context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Verificar permissões
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-muted-foreground">Gerencie as configurações globais</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">Ativa o modo de manutenção para todos os usuários</p>
              </div>
              <Switch id="maintenance-mode" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-registration">Permitir Cadastros</Label>
                <p className="text-sm text-muted-foreground">Permite que novos usuários se cadastrem no sistema</p>
              </div>
              <Switch id="allow-registration" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-approve">Aprovação Automática</Label>
                <p className="text-sm text-muted-foreground">Aprova automaticamente novos usuários</p>
              </div>
              <Switch id="auto-approve" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">Servidor SMTP</Label>
              <Input id="smtp-server" defaultValue="smtp.example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-port">Porta SMTP</Label>
              <Input id="smtp-port" defaultValue="587" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-user">Usuário SMTP</Label>
              <Input id="smtp-user" defaultValue="no-reply@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-password">Senha SMTP</Label>
              <Input id="smtp-password" type="password" defaultValue="********" />
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
