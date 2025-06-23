import axios from "axios"
import type { LoginRequest, LoginResponse, RegisterRequest, RoleResponse, AuthUser } from "@/types/auth"
import type { Convite, ConviteEnviado, Membro } from "@/types/invites"
import type { Patrimonio, PatrimonioDetalhado, CreatePatrimonioRequest } from "@/types/patrimonio"
import type {
  SaidaCategoria,
  TipoSaida,
  SaidaPrioridade,
  EntradaCategoria,
  TipoEntrada,
  CreateSaidaRequest,
  CreateEntradaRequest,
  Saida,
  Entrada,
  Metadata,
} from "@/types/financeiro"

type SaidaCategoriasResponse = SaidaCategoria[]
type SaidaPrioridadesResponse = { saidas: SaidaPrioridade[]; saidasPublicas: SaidaPrioridade[] }

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  register: (data: RegisterRequest) => api.post("/users", data),
  login: (data: LoginRequest) => api.post<LoginResponse>("/users/login", data),
  getRole: () => api.get<RoleResponse>("/grupo-financeiro/cargo"),
  getProfile: () => api.get<AuthUser>("/users/profile"),
  updateProfile: (data: Partial<RegisterRequest>) => api.patch("/users/update", data),
}

export const inviteApi = {
  getReceivedInvites: () => api.get<{ convitesUsuario: Convite[] }>("/usuario/convites"),
  acceptInvite: (id: number) => api.post(`/usuario/convites/aceitar/${id}`),
  declineInvite: (id: number) => api.post(`/usuario/convites/recusar/${id}`),
  getSentInvites: () => api.get<{ convites: ConviteEnviado[] }>("/convites"),
  sendInvite: (data: { cargo: string; usuarioDestinoEmail: string }) =>
    api.post("/grupo-financeiro/convite-por-email", data),
  removeInvite: (id: number) => api.post(`/convite/${id}`),
}

export const groupApi = {
  createGroup: (data: { nome: string }) => api.post("/groups", data),
  getMembers: () => api.get<{ membros: Membro[] }>("/grupo-financeiro/membros"),
  quitGroup: () => api.post("/groups/quit"),
}

export const patrimonioApi = {
  create: (data: CreatePatrimonioRequest) => api.post("/patrimonio", data),
  getOwn: () => api.post<{ patrimonios: Patrimonio[] }>("/patrimonios"),
  getById: (id: number) => api.get<{ patrimonios: PatrimonioDetalhado }>(`/patrimonio/${id}`),
  delete: (id: number) => api.delete(`/patrimonio/${id}`),
  update: (id: number, data: Partial<CreatePatrimonioRequest>) => api.patch(`/patrimonio/${id}`, data),
  getGroupPatrimonios: () => api.post<{ patrimonios: Patrimonio[] }>("/patrimonios/grupo-financeiro"),
}

export const financeiroApi = {
  // Saídas
  getSaidaCategorias: () => api.get<SaidaCategoriasResponse>("/saida/categorias"),
  getSaidaTipos: () => api.get<{ tiposPublicos: TipoSaida[]; tiposPrivados: TipoSaida[] }>("/saida-tipo/todos"),
  getSaidaPrioridades: () => api.get<SaidaPrioridadesResponse>("/saida-prioridade"),
  createSaida: (data: CreateSaidaRequest) => api.post("/saida", data),
  getSaidas: () => api.get<{ saidas: Saida[]; usuario: any }>("/saidas"),
  getSaidasGrupo: () => api.get<{ saidas: Saida[] }>("/saidas/grupo"),
  deleteSaida: (id: number) => api.delete(`/saida/${id}`),

  // Entradas
  getEntradaCategorias: () =>
    api.get<{ entradasCategoriasPadrao: EntradaCategoria[]; entradasCategoriasUsuario: EntradaCategoria[] }>(
      "/entrada/categorias",
    ),
  getEntradaTipos: () => api.get<{ tiposPublicos: TipoEntrada[]; tiposPrivados: TipoEntrada[] }>("/entrada-tipo/todos"),
  createEntrada: (data: CreateEntradaRequest) => api.post("/entrada", data),
  getEntradas: () => api.get<{ entradas: Entrada[]; usuario: any }>("/entradas"),
  getEntradasGrupo: () => api.get<{ entradas: Entrada[] }>("/entradas/grupo"),
  deleteEntrada: (id: number) => api.delete(`/entrada/${id}`),

  // Metadata
  getMetadata: () => api.get<Metadata>("/metadata"),
}

export default api
