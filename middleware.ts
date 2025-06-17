import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Função para obter o usuário da sessão
function getUserFromSession(request: NextRequest) {
  const role = request.cookies.get("user_role")?.value

  if (!role) return null

  return {
    role: role as "CONVIDADO" | "MEMBRO" | "ADMIN",
  }
}

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/login", "/register"]

// Rota exclusiva para CONVIDADO
const inviteRoutes = ["/convite"]

// Rotas que MEMBRO e ADMIN podem acessar
const memberRoutes = ["/dashboard"]

// Rota que todos podem acessar
const profileRoutes = ["/perfil"]

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

  // Perfil pode ser acessado por todos os usuários autenticados
  if (profileRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Lógica de redirecionamento baseada em permissões
  if (user.role === "CONVIDADO") {
    // CONVIDADO só pode acessar convites e perfil
    if (!inviteRoutes.some((route) => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = "/convite"
      return NextResponse.redirect(url)
    }
  } else if (user.role === "MEMBRO" || user.role === "ADMIN") {
    // MEMBRO e ADMIN não podem acessar rota de convites
    if (inviteRoutes.some((route) => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
