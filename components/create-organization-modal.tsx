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
import { createOrganization, type CreateOrganizationData } from "../lib/api"

interface CreateOrganizationModalProps {
  onSuccess?: () => void
}

export default function CreateOrganizationModal({ onSuccess }: CreateOrganizationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [organizationName, setOrganizationName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!organizationName.trim()) {
      setError("Nome da organização é obrigatório")
      return
    }

    setIsLoading(true)

    try {
      const data: CreateOrganizationData = {
        nome: organizationName.trim(),
      }

      await createOrganization(data)
      console.log("Organização criada com sucesso")

      setSuccess(true)
      setOrganizationName("")

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setSuccess(false)
        setIsOpen(false)
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error("Erro ao criar organização:", error)
      setError(error instanceof Error ? error.message : "Erro ao criar organização")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open)
      if (!open) {
        setOrganizationName("")
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
          Criar Nova Organização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Criar Nova Organização</span>
          </DialogTitle>
          <DialogDescription>Digite o nome da sua nova organização</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Organização criada com sucesso! Fechando...
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
              <Label htmlFor="organizationName">Nome da Organização</Label>
              <Input
                id="organizationName"
                placeholder="Digite o nome da organização"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !organizationName.trim()}>
                {isLoading ? "Criando..." : "Criar Organização"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
