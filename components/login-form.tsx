"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle, TrendingUp } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { LogoDark } from "@/components/ui/logo-dark"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    try {
      await login(email, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
    }
  }

  return (
    <div className="min-h-screen finlife-gradient flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
              <LogoDark height={53} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
          <p className="text-emerald-100">Acesse sua conta para gerenciar suas finanças</p>
        </div>

        {/* Card de Login */}
        <Card className="finlife-card border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-800">Entrar</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Digite suas credenciais para acessar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 finlife-input h-12 text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 finlife-input h-12 text-slate-700"
                    required
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
              </div>

              <Button
                type="submit"
                className="w-full finlife-button-primary h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Entrar</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-emerald-100">
              <p className="text-sm text-slate-600">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                >
                  Cadastre-se gratuitamente
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
