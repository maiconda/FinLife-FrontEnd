"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "../../context/auth-context"
import { LogoLight } from "@/components/ui/logo-light"
import { LayoutDashboard, User, LogOut, TrendingUp, Wallet, PieChart } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Carteira",
      icon: Wallet,
      href: "/carteira",
      active: pathname === "/carteira",
    },
    {
      label: "Investimentos",
      icon: TrendingUp,
      href: "/investimentos",
      active: pathname === "/investimentos",
    },
    {
      label: "Relatórios",
      icon: PieChart,
      href: "/relatorios",
      active: pathname === "/relatorios",
    },
    {
      label: "Perfil",
      icon: User,
      href: "/perfil",
      active: pathname === "/perfil",
    },
  ]

  return (
    <div className="h-full flex flex-col finlife-sidebar text-white w-64 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <LogoLight height={40} className="mb-4" />
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <div className="text-sm font-medium text-emerald-300">{user?.name}</div>
          <div className="text-xs text-emerald-400 capitalize flex items-center mt-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
            {user?.role}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-3 text-sm px-4 py-3 rounded-xl transition-all duration-200 group",
                route.active
                  ? "bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50",
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  route.active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-300",
                )}
              />
              <span className="font-medium">{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 h-12 rounded-xl transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Sair</span>
        </Button>
      </div>
    </div>
  )
}
