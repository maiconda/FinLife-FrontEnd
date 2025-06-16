const API_URL = process.env.NEXT_PUBLIC_API_URL

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

export async function registerUser(data: RegisterData): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao cadastrar usuário")
  }
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao fazer login")
  }

  return response.json()
}

export async function getUserFromToken(token: string): Promise<any> {
  // Simular decodificação do JWT para obter dados do usuário
  // Em produção, você faria uma chamada para verificar o token
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return {
      id: payload.sub || payload.id,
      email: payload.email,
      name: payload.name || payload.nome,
      role: payload.role || "membro", // Default para membro se não especificado
    }
  } catch {
    throw new Error("Token inválido")
  }
}
