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
import { Edit, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { updateUserProfile, type UpdateUserData, type UserProfileResponse } from "../lib/api"

interface EditProfileModalProps {
  profileData: UserProfileResponse
  onSuccess: (updatedData: UserProfileResponse) => void
}

export default function EditProfileModal({ profileData, onSuccess }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    nome: profileData.user.nome,
    sobrenome: profileData.user.sobrenome,
    dthr_nascimento: profileData.user.dthr_nascimento.split("T")[0], // Converter para formato date input
    endereco: profileData.user.endereco || "",
    email: profileData.userInfo.email,
    senha: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      setError("Nome é obrigatório")
      return false
    }
    if (!formData.sobrenome.trim()) {
      setError("Sobrenome é obrigatório")
      return false
    }
    if (!formData.dthr_nascimento) {
      setError("Data de nascimento é obrigatória")
      return false
    }
    if (!formData.endereco.trim()) {
      setError("Endereço é obrigatório")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email é obrigatório")
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Email inválido")
      return false
    }

    // Validar data de nascimento
    const birthDate = new Date(formData.dthr_nascimento)
    const today = new Date()
    if (birthDate > today) {
      setError("Data de nascimento não pode ser futura")
      return false
    }

    // Validar senha se fornecida
    if (formData.senha && formData.senha.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para envio
      const updateData: UpdateUserData = {
        nome: formData.nome.trim(),
        sobrenome: formData.sobrenome.trim(),
        dthr_nascimento: new Date(formData.dthr_nascimento).toISOString(),
        endereco: formData.endereco.trim(),
        email: formData.email.trim().toLowerCase(),
      }

      // Incluir senha apenas se foi fornecida
      if (formData.senha) {
        updateData.senha = formData.senha
      }

      console.log("Dados para atualização:", updateData)

      // Fazer a chamada para a API
      const updatedProfile = await updateUserProfile(updateData)

      console.log("Perfil atualizado com sucesso:", updatedProfile)
      setSuccess(true)

      // Chamar callback para atualizar a tela de perfil
      onSuccess(updatedProfile)

      // Fechar modal após 2 segundos
      setTimeout(() => {
        setSuccess(false)
        setIsOpen(false)
        setFormData((prev) => ({ ...prev, senha: "" })) // Limpar senha
      }, 2000)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      setError(error instanceof Error ? error.message : "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open)
      if (!open) {
        // Reset form quando fechar
        setFormData({
          nome: profileData.user.nome,
          sobrenome: profileData.user.sobrenome,
          dthr_nascimento: profileData.user.dthr_nascimento.split("T")[0],
          endereco: profileData.user.endereco || "",
          email: profileData.userInfo.email,
          senha: "",
        })
        setError("")
        setSuccess(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar Perfil</span>
          </DialogTitle>
          <DialogDescription>Atualize suas informações pessoais</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">Perfil atualizado com sucesso! Fechando...</AlertDescription>
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

            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome *</Label>
                <Input
                  id="sobrenome"
                  placeholder="Seu sobrenome"
                  value={formData.sobrenome}
                  onChange={(e) => handleInputChange("sobrenome", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="dthr_nascimento">Data de Nascimento *</Label>
              <Input
                id="dthr_nascimento"
                type="date"
                value={formData.dthr_nascimento}
                onChange={(e) => handleInputChange("dthr_nascimento", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                placeholder="Seu endereço completo"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha">Nova Senha (opcional)</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Deixe em branco para manter a atual"
                  value={formData.senha}
                  onChange={(e) => handleInputChange("senha", e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo 6 caracteres. Deixe em branco para manter a senha atual.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
