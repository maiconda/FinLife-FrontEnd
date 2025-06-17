"use client"

import Image from "next/image"

interface LogoLightProps {
  height?: number
  className?: string
}

export function LogoLight({ height = 40, className = "" }: LogoLightProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo_light.png"
        alt="FinLife"
        height={height}
        width={0}
        priority
        className="h-auto w-auto object-contain"
        style={{ height: `${height}px` }}
      />
    </div>
  )
}
