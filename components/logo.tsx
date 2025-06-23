"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  height?: number
}

export function Logo({ className = "", height = 25 }: LogoProps) {
  const { theme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`bg-muted/20 animate-pulse rounded ${className}`} style={{ height, width: "auto" }} />
  }

  const getCurrentTheme = () => {
    if (resolvedTheme) return resolvedTheme
    if (theme && theme !== "system") return theme
    if (systemTheme) return systemTheme
    return "light"
  }

  const currentTheme = getCurrentTheme()
  const logoSrc = currentTheme === "light" ? "/logo-dark.png" : "/logo-light.png"

  return (
    <Image
      src={logoSrc || "/placeholder.svg"}
      alt="FinLife"
      height={height}
      width={0}
      style={{ width: "auto", height }}
      className={className}
      priority
    />
  )
}
