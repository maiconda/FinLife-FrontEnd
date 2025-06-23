"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

const publicRoutes = ["/login", "/register"]
const roleRoutes = {
  CONVIDADO: ["/dashboard", "/profile"],
  ADMIN: ["/dashboard", "/profile", "/members", "/invites", "/patrimonio", "/financeiro"],
  MEMBRO: ["/dashboard", "/profile", "/members", "/patrimonio", "/financeiro"],
}

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login")
      return
    }

    if (user && publicRoutes.includes(pathname)) {
      router.push("/dashboard")
      return
    }

    if (user && role) {
      const allowedRoutes = roleRoutes[role]
      const isRouteAllowed = allowedRoutes.some((route) => pathname.startsWith(route) || pathname === route)

      if (!isRouteAllowed) {
        router.push("/dashboard")
        return
      }
    }
  }, [user, role, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
