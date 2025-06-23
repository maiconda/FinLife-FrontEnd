"use client"

import { useAuth } from "@/contexts/auth-context"
import { ConvidadoDashboard } from "@/components/dashboard/convidado-dashboard"
import { MainDashboard } from "@/components/dashboard/main-dashboard"

export default function DashboardPage() {
  const { role } = useAuth()

  if (role === "CONVIDADO") {
    return <ConvidadoDashboard />
  }

  return <MainDashboard />
}
