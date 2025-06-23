export interface User {
  nome: string
  sobrenome: string
  cpf: string
  dthr_nascimento: string
  id: number
}

export interface UserInfo {
  id: number
  email: string
  endereco: string
}

export interface AuthUser {
  user: User
  userInfo: UserInfo
}

export type Role = "CONVIDADO" | "ADMIN" | "MEMBRO"

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  nome: string
  sobrenome: string
  cpf: string
  dthr_nascimento: string
  endereco: string
  email: string
  senha: string
}

export interface RoleResponse {
  role: Role
}
