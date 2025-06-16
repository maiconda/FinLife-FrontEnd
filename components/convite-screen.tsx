"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Clock, UserPlus } from "lucide-react"
import { useAuth } from "../context/auth-context"

export default function ConviteScreen() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Convite Pendente</CardTitle>
          <CardDescription>Olá {user?.name}, seu acesso está pendente de aprovação</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-orange-900">Aguardando Aprovação</h3>
                <p className="text-sm text-orange-700">
                  Seu convite foi enviado para análise. Você receberá um email quando for aprovado.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Próximos passos:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Aguarde a aprovação do administrador</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Verifique seu email regularmente</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" onClick={logout} className="w-full">
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
