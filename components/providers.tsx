"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { RouteGuard } from "@/components/route-guard"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouteGuard>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto py-8 px-4">{children}</main>
          </div>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </ThemeProvider>
  )
}
