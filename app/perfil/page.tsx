"use client"

import ProfileScreen from "../../components/profile-screen"
import DashboardLayout from "../../components/layout/dashboard-layout"
import ConviteLayout from "../../components/layout/convite-layout"
import { useAuth } from "../../context/auth-context"

export default function PerfilPage() {
  const { user } = useAuth()

  // Se for usuário CONVIDADO, usar layout específico
  if (user?.role === "CONVIDADO") {
    return (
      <ConviteLayout>
        <ProfileScreen />
      </ConviteLayout>
    )
  }

  // Para outros usuários (MEMBRO e ADMIN), usar layout padrão
  return (
    <DashboardLayout>
      <ProfileScreen />
    </DashboardLayout>
  )
}
