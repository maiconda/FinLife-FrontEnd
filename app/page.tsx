"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/auth-context"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Redirecionar baseado na permissão
    if (!user) {
      router.push("/login")
    } else if (user.role === "CONVIDADO") {
      router.push("/convite")
    } else {
      router.push("/dashboard")
    }
  }, [user, router])

  return null // Não renderiza nada, apenas redireciona
}
