import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Criar instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface RegisterData {
  nome: string
  sobrenome: string
  cpf: string
  dthr_nascimento: string
  endereco: string
  email: string
  senha: string
}

export interface LoginData {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
}

export interface RoleResponse {
  role: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface UserProfileResponse {
  user: {
    nome: string
    sobrenome: string
    cpf: string
    dthr_nascimento: string
    id: number
  }
  userInfo: {
    id: number
    email: string
  }
}

export interface ConviteItem {
  id: number
  cargo: string
  usuarioDestinoId: number
  grupo_financeiro_usuarioId: number
  recusado: boolean
  pendente: boolean
  grupoFinanceiroId: number
}

export interface ConvitesResponse {
  convitesUsuario: ConviteItem[]
}

export interface AcceptInviteResponse {
  usuarioOrgCriado: {
    id: number
    id_ativo: boolean
    dthr_cadastro: string
    role: string
    id_usuario_info_cadastro: number
    id_usuario_info: number
    id_grupo_financeiro: number
  }
}

export interface CreateOrganizationData {
  nome: string
}

export async function registerUser(data: RegisterData): Promise<void> {
  try {
    await api.post("/users", data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao cadastrar usuário"
      throw new Error(message)
    }
    throw new Error("Erro ao cadastrar usuário")
  }
}

export async function loginUser(data: LoginData): Promise<{ user: User; token: string }> {
  try {
    // 1. Fazer login e obter token
    const loginResponse = await api.post<LoginResponse>("/users/login", data)
    const { token } = loginResponse.data

    // 2. Configurar token no header para próximas requisições
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`

    // 3. Obter role do usuário
    const roleResponse = await api.post<RoleResponse>("/dev/cargo")
    const { role } = roleResponse.data

    // 4. Decodificar token para obter dados do usuário
    const userData = getUserFromToken(token)

    // 5. Combinar dados do token com a role da API
    const user: User = {
      ...userData,
      role: role, // Usar role da API em vez do token
    }

    return { user, token }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao fazer login"
      throw new Error(message)
    }
    throw new Error("Erro ao fazer login")
  }
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const response = await api.get<UserProfileResponse>("/users/profile")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao obter perfil do usuário"
      throw new Error(message)
    }
    throw new Error("Erro ao obter perfil do usuário")
  }
}

export async function getUserInvites(): Promise<ConvitesResponse> {
  try {
    const response = await api.get<ConvitesResponse>("/usuario/convites")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao obter convites"
      throw new Error(message)
    }
    throw new Error("Erro ao obter convites")
  }
}

export async function acceptInvite(inviteId: number): Promise<AcceptInviteResponse> {
  try {
    const response = await api.post<AcceptInviteResponse>(`/usuario/convites/aceitar/${inviteId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao aceitar convite"
      throw new Error(message)
    }
    throw new Error("Erro ao aceitar convite")
  }
}

export async function createOrganization(data: CreateOrganizationData): Promise<void> {
  try {
    await api.post("/groups", data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao criar organização"
      throw new Error(message)
    }
    throw new Error("Erro ao criar organização")
  }
}

export async function loginRole(): Promise<RoleResponse> {
  try {
    const response = await api.post<RoleResponse>("/dev/cargo")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao obter cargo do usuário"
      throw new Error(message)
    }
    throw new Error("Erro ao obter cargo do usuário")
  }
}

export function getUserFromToken(token: string): Omit<User, "role"> {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return {
      id: payload.sub || payload.id || "unknown",
      email: payload.email || "",
      name: payload.name || payload.nome || "Usuário",
    }
  } catch {
    throw new Error("Token inválido")
  }
}

// Função para configurar token em requisições futuras
export function setAuthToken(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Função para remover token
export function removeAuthToken() {
  delete api.defaults.headers.common["Authorization"]
}

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      removeAuthToken()
      // Aqui você pode redirecionar para login se necessário
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
