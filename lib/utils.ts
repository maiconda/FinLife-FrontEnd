import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Role } from "@/types/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRole(role: Role): string {
  const roleMap = {
    ADMIN: "Administrador",
    CONVIDADO: "Convidado",
    MEMBRO: "Membro",
  }
  return roleMap[role] || role
}

export function formatCurrency(value: string | number): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR")
}
