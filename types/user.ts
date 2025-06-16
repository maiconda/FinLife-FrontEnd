export type UserRole = "convite" | "membro" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}
