"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Save, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    dthr_nascimento: "",
    endereco: "",
    email: "",
    senha: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.user.nome,
        sobrenome: user.user.sobrenome,
        dthr_nascimento: user.user.dthr_nascimento.split("T")[0],
        endereco: user.userInfo.endereco,
        email: user.userInfo.email,
        senha: "",
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToUpdate: any = {}

      if (formData.nome !== user?.user.nome) dataToUpdate.nome = formData.nome
      if (formData.sobrenome !== user?.user.sobrenome) dataToUpdate.sobrenome = formData.sobrenome
      if (formData.dthr_nascimento !== user?.user.dthr_nascimento.split("T")[0]) {
        dataToUpdate.dthr_nascimento = new Date(formData.dthr_nascimento).toISOString()
      }
      if (formData.endereco !== user?.userInfo.endereco) dataToUpdate.endereco = formData.endereco
      if (formData.email !== user?.userInfo.email) dataToUpdate.email = formData.email
      if (formData.senha) dataToUpdate.senha = formData.senha

      if (Object.keys(dataToUpdate).length === 0) {
        toast({
          title: "Nenhuma alteração detectada",
          description: "Não há dados para atualizar.",
        })
        return
      }

      await updateUser(dataToUpdate)
      setFormData((prev) => ({ ...prev, senha: "" }))
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.response?.data?.message || "Erro interno do servidor.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Usuário não encontrado</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          Meu Perfil
        </h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize seus dados pessoais. Deixe a senha em branco se não quiser alterá-la.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dthr_nascimento">Data de Nascimento</Label>
              <Input
                id="dthr_nascimento"
                name="dthr_nascimento"
                type="date"
                value={formData.dthr_nascimento}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Nova Senha (opcional)</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Deixe em branco para manter a atual"
                minLength={6}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">ID do Usuário:</span>
              <span className="font-medium">{user.user.id}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">CPF:</span>
              <span className="font-medium">{user.user.cpf}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
