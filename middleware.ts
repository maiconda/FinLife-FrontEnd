import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Função para obter o usuário da sessão (simulada)
function getUserFromSession(request: NextRequest) {
  // Em produção, você verificaria um token JWT ou cookie de sessão
  // Aqui estamos simulando com cookies para demonstração
  const role = request.cookies.get("user_role")?.value

  if (!role) return null

  return {
    role: role as "convite" | "membro" | "admin",
  }
}

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/login", "/register"]

// Rotas que apenas admin pode acessar
const adminRoutes = ["/admin", "/admin/usuarios", "/admin/configuracoes"]

// Rotas que membros e admin podem acessar
const memberRoutes = ["/dashboard", "/perfil", "/documentos"]

// Rota exclusiva para convites
const inviteRoutes = ["/convite"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const user = getUserFromSession(request)

  // Permitir acesso a rotas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Lógica de redirecionamento baseada em permissões
  if (user.role === "convite") {
    // Usuários com convite só podem acessar a rota de convite
    if (!inviteRoutes.some((route) => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = "/convite"
      return NextResponse.redirect(url)
    }
  } else if (user.role === "membro") {
    // Membros não podem acessar rotas de admin
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // Admin pode acessar todas as rotas exceto a de convite
  if (user.role === "admin" && inviteRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
