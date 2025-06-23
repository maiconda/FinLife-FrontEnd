"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import type { AuthUser, Role, LoginRequest, RegisterRequest } from "@/types/auth"

interface AuthContextType {
  user: AuthUser | null
  role: Role | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshRole: () => Promise<void>
  updateUser: (data: Partial<RegisterRequest>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshRole = async () => {
    try {
      const response = await authApi.getRole()
      setRole(response.data.role)
    } catch (error) {
      console.error("Error fetching role:", error)
      setRole("CONVIDADO")
    }
  }

  const loadUser = async () => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const [userResponse] = await Promise.all([authApi.getProfile(), refreshRole()])
      setUser(userResponse.data)
    } catch (error) {
      console.error("Error loading user:", error)
      localStorage.removeItem("token")
      setUser(null)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data)
      localStorage.setItem("token", response.data.token)

      const [userResponse] = await Promise.all([authApi.getProfile(), refreshRole()])

      setUser(userResponse.data)
      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data)
      await login({ email: data.email, senha: data.senha })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    setUser(null)
    setRole(null)
    router.push("/login")
  }

  const updateUser = async (data: Partial<RegisterRequest>) => {
    try {
      await authApi.updateProfile(data)
      const userResponse = await authApi.getProfile()
      setUser(userResponse.data)
    } catch (error) {
      throw error
    }
  }

  const contextValue: AuthContextType = {
    user,
    role,
    loading,
    login,
    register,
    logout,
    refreshRole,
    updateUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
