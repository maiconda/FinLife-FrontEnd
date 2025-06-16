"use client"

import type React from "react"

import { useAuth } from "../../context/auth-context"
import Sidebar from "./sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  // Verificar permissões
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role === "convite") {
      router.push("/convite")
    }
  }, [user, router])

  if (!user || user.role === "convite") {
    return null // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
