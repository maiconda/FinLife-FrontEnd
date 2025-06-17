"use client"

import Image from "next/image"

interface LogoDarkProps {
  height?: number
  className?: string
}

export function LogoDark({ height = 40, className = "" }: LogoDarkProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="logoDark.png"
        alt="FinLife"
        height={height}
        width={200}
        priority
        className="h-auto w-auto object-contain"
        style={{ height: `${height}px` }}
      />
    </div>
  )
}
