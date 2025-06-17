"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, FileText, AlertCircle, RefreshCw } from "lucide-react"
import { getUserProfile, type UserProfileResponse } from "../lib/api"
import { useAuth } from "../context/auth-context"
import EditProfileModal from "./edit-profile-modal"

export default function ProfileScreen() {
  const { user: authUser } = useAuth()
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProfile = async () => {
    setIsLoading(true)
    setError("")

    try {
      const data = await getUserProfile()
      setProfileData(data)
      console.log("Dados do perfil:", data)
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
      setError(error instanceof Error ? error.message : "Erro ao carregar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = (updatedData: UserProfileResponse) => {
    setProfileData(updatedData)
    console.log("Perfil atualizado na tela:", updatedData)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={fetchProfile} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Nenhum dado de perfil encontrado.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-1">Visualize e edite suas informações pessoais</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={authUser?.role === "ADMIN" ? "default" : "secondary"}>{authUser?.role}</Badge>
            <EditProfileModal profileData={profileData} onSuccess={handleProfileUpdate} />
            <Button onClick={fetchProfile} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Informações */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                <p className="text-base">
                  {profileData.user.nome} {profileData.user.sobrenome}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p className="text-base">{formatCPF(profileData.user.cpf)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                <p className="text-base">
                  {formatDate(profileData.user.dthr_nascimento)} ({calculateAge(profileData.user.dthr_nascimento)} anos)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-base">{profileData.user.endereco || "Não informado"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">ID do Usuário</p>
                <p className="text-base">#{profileData.user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Informações da Conta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{profileData.userInfo.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">ID da Conta</p>
                <p className="text-base">#{profileData.userInfo.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nível de Acesso</p>
                <Badge variant={authUser?.role === "ADMIN" ? "default" : "secondary"} className="mt-1">
                  {authUser?.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{calculateAge(profileData.user.dthr_nascimento)}</p>
              <p className="text-sm text-gray-600">Anos de idade</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">#{profileData.user.id}</p>
              <p className="text-sm text-gray-600">ID do perfil</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 capitalize">{authUser?.role}</p>
              <p className="text-sm text-gray-600">Nível de acesso</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
