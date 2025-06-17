"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building, AlertCircle, CheckCircle } from "lucide-react"
import { createOrganization, loginRole, type CreateOrganizationData } from "../lib/api"
import { useAuth } from "../context/auth-context"
import { useRouter } from "next/navigation"

interface CreateGroupModalProps {
  onSuccess?: () => void
}

export default function CreateGroupModal({ onSuccess }: CreateGroupModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { user, setUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!groupName.trim()) {
      setError("Nome do grupo financeiro é obrigatório")
      return
    }

    setIsLoading(true)

    try {
      const data: CreateOrganizationData = {
        nome: groupName.trim(),
      }

      await createOrganization(data)
      console.log("Grupo financeiro criado com sucesso")

      // Buscar nova role do usuário
      const roleData = await loginRole()
      console.log("Nova role:", roleData.role)

      // Atualizar role no contexto
      if (user) {
        const updatedUser = {
          ...user,
          role: roleData.role as "CONVIDADO" | "MEMBRO" | "ADMIN",
        }
        setUser(updatedUser)

        // Atualizar cookie para o middleware
        document.cookie = `user_role=${roleData.role}; path=/;`
      }

      setSuccess(true)
      setGroupName("")

      // Fechar modal e redirecionar após 2 segundos
      setTimeout(() => {
        setSuccess(false)
        setIsOpen(false)
        onSuccess?.()

        // Redirecionar baseado na nova role
        if (roleData.role === "CONVIDADO") {
          router.push("/convite")
        } else {
          router.push("/dashboard")
        }
      }, 2000)
    } catch (error) {
      console.error("Erro ao criar grupo financeiro:", error)
      setError(error instanceof Error ? error.message : "Erro ao criar grupo financeiro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open)
      if (!open) {
        setGroupName("")
        setError("")
        setSuccess(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Building className="h-4 w-4 mr-2" />
          Criar Novo Grupo Financeiro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Criar Novo Grupo Financeiro</span>
          </DialogTitle>
          <DialogDescription>Digite o nome do seu novo grupo financeiro</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Grupo financeiro criado com sucesso! Atualizando permissões...
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="groupName">Nome do Grupo Financeiro</Label>
              <Input
                id="groupName"
                placeholder="Digite o nome do grupo financeiro"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !groupName.trim()}>
                {isLoading ? "Criando..." : "Criar Grupo Financeiro"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
