"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "../../context/auth-context"
import { LayoutDashboard, FileText, User, Settings, Users, Shield, LogOut } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isAdmin = user?.role === "admin"

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Documentos",
      icon: FileText,
      href: "/documentos",
      active: pathname === "/documentos",
    },
    {
      label: "Perfil",
      icon: User,
      href: "/perfil",
      active: pathname === "/perfil",
    },
  ]

  const adminRoutes = [
    {
      label: "Usuários",
      icon: Users,
      href: "/admin/usuarios",
      active: pathname === "/admin/usuarios",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/admin/configuracoes",
      active: pathname === "/admin/configuracoes",
    },
    {
      label: "Segurança",
      icon: Shield,
      href: "/admin/seguranca",
      active: pathname === "/admin/seguranca",
    },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white w-64 py-4">
      <div className="px-4 py-2 mb-6">
        <h1 className="text-xl font-bold">Sistema Admin</h1>
        <div className="text-sm text-gray-400 mt-1">
          {user?.name} ({user?.role})
        </div>
      </div>

      <div className="space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm px-3 py-2 rounded-md transition-colors",
              route.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>

      {isAdmin && (
        <>
          <div className="mt-6 px-4">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Administração</h2>
          </div>
          <div className="space-y-1 px-3">
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-x-2 text-sm px-3 py-2 rounded-md transition-colors",
                  route.active ? "bg-blue-900 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-auto px-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  )
}
