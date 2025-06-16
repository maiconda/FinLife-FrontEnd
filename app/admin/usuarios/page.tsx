"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "../../../components/layout/dashboard-layout"
import { useAuth } from "../../../context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Edit, Trash, UserPlus } from "lucide-react"

export default function UsuariosPage() {
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

  const mockUsers = [
    { id: 1, name: "João Silva", email: "joao@example.com", role: "admin" },
    { id: 2, name: "Maria Souza", email: "maria@example.com", role: "membro" },
    { id: 3, name: "Pedro Santos", email: "pedro@example.com", role: "membro" },
    { id: 4, name: "Ana Oliveira", email: "ana@example.com", role: "convite" },
    { id: 5, name: "Carlos Pereira", email: "carlos@example.com", role: "membro" },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Administre os usuários do sistema</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Permissão</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((mockUser) => (
                  <tr key={mockUser.id} className="border-b">
                    <td className="py-3 px-4">{mockUser.name}</td>
                    <td className="py-3 px-4">{mockUser.email}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          mockUser.role === "admin" ? "default" : mockUser.role === "convite" ? "outline" : "secondary"
                        }
                      >
                        {mockUser.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
