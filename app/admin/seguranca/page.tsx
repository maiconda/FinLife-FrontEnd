"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "../../../components/layout/dashboard-layout"
import { useAuth } from "../../../context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function SegurancaPage() {
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

  const mockLogs = [
    {
      id: 1,
      event: "Login bem-sucedido",
      user: "admin@test.com",
      ip: "192.168.1.1",
      date: "2025-05-28 10:15:22",
      status: "success",
    },
    {
      id: 2,
      event: "Tentativa de login falhou",
      user: "unknown@test.com",
      ip: "203.0.113.42",
      date: "2025-05-28 09:45:12",
      status: "error",
    },
    {
      id: 3,
      event: "Alteração de permissão",
      user: "admin@test.com",
      ip: "192.168.1.1",
      date: "2025-05-27 16:30:45",
      status: "warning",
    },
    {
      id: 4,
      event: "Usuário criado",
      user: "admin@test.com",
      ip: "192.168.1.1",
      date: "2025-05-27 14:22:18",
      status: "success",
    },
    {
      id: 5,
      event: "Tentativa de acesso não autorizado",
      user: "membro@test.com",
      ip: "192.168.1.5",
      date: "2025-05-27 11:05:33",
      status: "error",
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Logs de Segurança</h1>
        <p className="text-muted-foreground">Monitore a atividade e segurança do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Evento</th>
                  <th className="text-left py-3 px-4">Usuário</th>
                  <th className="text-left py-3 px-4">IP</th>
                  <th className="text-left py-3 px-4">Data</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="py-3 px-4">{log.event}</td>
                    <td className="py-3 px-4">{log.user}</td>
                    <td className="py-3 px-4">{log.ip}</td>
                    <td className="py-3 px-4">{log.date}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          log.status === "success" ? "default" : log.status === "error" ? "destructive" : "outline"
                        }
                        className="flex items-center space-x-1"
                      >
                        {log.status === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {log.status === "error" && <XCircle className="h-3 w-3 mr-1" />}
                        {log.status === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        <span>{log.status}</span>
                      </Badge>
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
