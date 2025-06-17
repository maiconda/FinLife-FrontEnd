export type UserRole = "CONVIDADO" | "MEMBRO" | "ADMIN"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}
