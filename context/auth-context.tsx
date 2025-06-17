"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "../types/user"
import { loginUser, setAuthToken, removeAuthToken, getUserFromToken, loginRole, type LoginData } from "../lib/api"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()

  // Verificar se há um token na sessão ao carregar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // Configurar token no axios
          setAuthToken(token)

          // Obter dados do usuário do token
          const userData = getUserFromToken(token)

          // Obter role atual da API
          const roleData = await loginRole()

          const fullUser: User = {
            ...userData,
            role: roleData.role as "CONVIDADO" | "MEMBRO" | "ADMIN",
          }

          setUser(fullUser)

          // Definir cookie para o middleware
          document.cookie = `user_role=${roleData.role}; path=/;`
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)
        // Token inválido, remover
        localStorage.removeItem("auth_token")
        removeAuthToken()
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      } finally {
        setIsInitializing(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true)

    try {
      const loginData: LoginData = { email, senha: password }
      const { user: userData, token } = await loginUser(loginData)

      // Salvar token
      localStorage.setItem("auth_token", token)

      // Definir cookie para o middleware
      document.cookie = `user_role=${userData.role}; path=/;`

      setUser(userData)

      // Redirecionar baseado na permissão
      if (userData.role === "CONVIDADO") {
        router.push("/convite")
      } else {
        router.push("/dashboard")
      }

      return userData
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    removeAuthToken()
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    setUser(null)
    router.push("/login")
  }

  // Não renderizar até inicializar
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
