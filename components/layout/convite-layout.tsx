"use client"

import type React from "react"

import { useAuth } from "../../context/auth-context"
import ConviteSidebar from "./convite-sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ConviteLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  // Verificar permissões - apenas CONVIDADO pode acessar
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role !== "CONVIDADO") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "CONVIDADO") {
    return null // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="h-screen flex">
      <ConviteSidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
