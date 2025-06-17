"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Mail, MapPin, Calendar, FileText, CheckCircle, AlertCircle, UserPlus } from "lucide-react"
import { LogoDark } from "@/components/ui/logo-dark"
import Link from "next/link"
import { registerUser, type RegisterData } from "../lib/api"

// Função de validação de CPF inline
function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, "")
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cpf.charAt(10))) return false

  return true
}

// Função de validação de email inline
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função de formatação de CPF inline
function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, "")
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    dthr_nascimento: "",
    endereco: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    if (field === "cpf") {
      const formatted = formatCPF(value)
      if (formatted !== value) {
        setFormData((prev) => ({ ...prev, cpf: formatted }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!formData.sobrenome.trim()) newErrors.sobrenome = "Sobrenome é obrigatório"
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório"
    if (!formData.dthr_nascimento) newErrors.dthr_nascimento = "Data de nascimento é obrigatória"
    if (!formData.endereco.trim()) newErrors.endereco = "Endereço é obrigatório"
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
    if (!formData.senha) newErrors.senha = "Senha é obrigatória"
    if (!formData.confirmarSenha) newErrors.confirmarSenha = "Confirmação de senha é obrigatória"

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres"
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem"
    }

    if (formData.dthr_nascimento) {
      const birthDate = new Date(formData.dthr_nascimento)
      const today = new Date()
      if (birthDate > today) {
        newErrors.dthr_nascimento = "Data de nascimento não pode ser futura"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const userData: RegisterData = {
        nome: formData.nome.trim(),
        sobrenome: formData.sobrenome.trim(),
        cpf: formData.cpf.replace(/[^\d]/g, ""),
        dthr_nascimento: new Date(formData.dthr_nascimento).toISOString(),
        endereco: formData.endereco.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
      }

      await registerUser(userData)
      setSuccess(true)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Erro ao cadastrar usuário")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen finlife-gradient flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md finlife-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Conta Criada!</CardTitle>
            <CardDescription className="text-slate-600">
              Bem-vindo ao FinLife! Sua jornada financeira começa agora.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700 font-medium">🎉 Parabéns! Sua conta foi criada com sucesso.</p>
              <p className="text-xs text-emerald-600 mt-1">
                Agora você pode fazer login e começar a organizar suas finanças.
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full finlife-button-primary h-12 text-base font-semibold">
                <UserPlus className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen finlife-gradient flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo e Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
              <LogoDark height={53} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-emerald-100">Comece sua jornada rumo à liberdade financeira</p>
        </div>

        {/* Card de Cadastro */}
        <Card className="finlife-card border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-800">Cadastro</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Preencha seus dados para criar sua conta gratuita
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {apiError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{apiError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-slate-700 font-medium">
                    Nome *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      className={`pl-10 finlife-input h-12 ${errors.nome ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sobrenome" className="text-slate-700 font-medium">
                    Sobrenome *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                    <Input
                      id="sobrenome"
                      placeholder="Seu sobrenome"
                      value={formData.sobrenome}
                      onChange={(e) => handleInputChange("sobrenome", e.target.value)}
                      className={`pl-10 finlife-input h-12 ${errors.sobrenome ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.sobrenome && <p className="text-sm text-red-500">{errors.sobrenome}</p>}
                </div>
              </div>

              {/* CPF e Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-slate-700 font-medium">
                    CPF *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                      className={`pl-10 finlife-input h-12 ${errors.cpf ? "border-red-500" : ""}`}
                      maxLength={14}
                    />
                  </div>
                  {errors.cpf && <p className="text-sm text-red-500">{errors.cpf}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dthr_nascimento" className="text-slate-700 font-medium">
                    Data de Nascimento *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                    <Input
                      id="dthr_nascimento"
                      type="date"
                      value={formData.dthr_nascimento}
                      onChange={(e) => handleInputChange("dthr_nascimento", e.target.value)}
                      className={`pl-10 finlife-input h-12 ${errors.dthr_nascimento ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.dthr_nascimento && <p className="text-sm text-red-500">{errors.dthr_nascimento}</p>}
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-slate-700 font-medium">
                  Endereço *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    id="endereco"
                    placeholder="Seu endereço completo"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    className={`pl-10 finlife-input h-12 ${errors.endereco ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 finlife-input h-12 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Senhas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-slate-700 font-medium">
                    Senha *
                  </Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.senha}
                      onChange={(e) => handleInputChange("senha", e.target.value)}
                      className={`pr-12 finlife-input h-12 ${errors.senha ? "border-red-500" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {errors.senha && <p className="text-sm text-red-500">{errors.senha}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha" className="text-slate-700 font-medium">
                    Confirmar Senha *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                      className={`pr-12 finlife-input h-12 ${errors.confirmarSenha ? "border-red-500" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full finlife-button-primary h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Criar Conta Gratuita</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-emerald-100">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-emerald-100 text-sm">© 2024 FinLife. Transformando sua relação com o dinheiro.</p>
        </div>
      </div>
    </div>
  )
}
