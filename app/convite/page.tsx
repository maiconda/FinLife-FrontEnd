"use client"

import ConviteScreen from "../../components/convite-screen"
import { useAuth } from "../../context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ConvitePage() {
  const { user } = useAuth()
  const router = useRouter()

  // Verificar permissões
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role !== "convite") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return <ConviteScreen />
}
