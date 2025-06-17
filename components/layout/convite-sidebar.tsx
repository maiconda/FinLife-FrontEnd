"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "../../context/auth-context"
import { User, LogOut, Mail } from "lucide-react"

export default function ConviteSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const routes = [
    {
      label: "Convites",
      icon: Mail,
      href: "/convite",
      active: pathname === "/convite",
    },
    {
      label: "Perfil",
      icon: User,
      href: "/perfil",
      active: pathname === "/perfil",
    },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white w-64 py-4">
      <div className="px-4 py-2 mb-6">
        <h1 className="text-xl font-bold">Sistema</h1>
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
