"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, User, LogOut, Users, DollarSign, Home, UserPlus, Menu, TrendingUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { formatRole } from "@/lib/utils"

export function Navigation() {
  const { user, role, logout } = useAuth()
  const { setTheme, resolvedTheme, theme, systemTheme } = useTheme()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Debug para verificar o estado do menu mobile
  useEffect(() => {
    console.log("Mobile menu state:", mobileOpen)
  }, [mobileOpen])

  if (!user || !role || pathname === "/login" || pathname === "/register") {
    return null
  }

  const getNavItems = () => {
    const items = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/profile", label: "Perfil", icon: User },
    ]

    if (role === "ADMIN") {
      items.push(
        { href: "/members", label: "Membros", icon: Users },
        { href: "/invites", label: "Convites", icon: UserPlus },
        { href: "/patrimonio", label: "Patrimônios", icon: DollarSign },
        { href: "/financeiro", label: "Financeiro", icon: TrendingUp },
      )
    } else if (role === "MEMBRO") {
      items.push(
        { href: "/members", label: "Membros", icon: Users },
        { href: "/patrimonio", label: "Patrimônios", icon: DollarSign },
        { href: "/financeiro", label: "Financeiro", icon: TrendingUp },
      )
    }

    return items
  }

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {getNavItems().map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            } ${mobile ? "w-full" : ""}`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )

  const getCurrentTheme = () => {
    if (resolvedTheme) return resolvedTheme
    if (theme && theme !== "system") return theme
    if (systemTheme) return systemTheme
    return "light"
  }

  const currentTheme = getCurrentTheme()
  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center">
            <Logo height={30} className="mb-2" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <NavItems />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium leading-none">{user.user.nome}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{formatRole(role)}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                onClick={() => {
                  console.log("Menu button clicked, current state:", mobileOpen)
                  setMobileOpen(!mobileOpen)
                }}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 z-[100]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.user.nome} {user.user.sobrenome}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatRole(role)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <NavItems mobile onItemClick={() => setMobileOpen(false)} />
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      setMobileOpen(false)
                      logout()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
