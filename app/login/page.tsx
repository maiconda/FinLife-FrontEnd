"use client"

import LoginForm from "../../components/login-form"
import { useAuth } from "../../context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      if (user.role === "convite") {
        router.push("/convite")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router])

  return <LoginForm />
}
