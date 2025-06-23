export interface Convite {
  membroId: {
    usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info: {
      usuario: {
        nome: string
        sobrenome: string
      }
      email: string
      id: number
    }
    role: string
  }
  id: number
  cargo: string
  grupo_financeiro_usuarioId: number
  usuarioDestinoId: number
  grupoFinanceiroId: number
}

export interface ConviteEnviado {
  usuario: {
    id: number
    email: string
  }
  membroId: {
    usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info: {
      usuario: {
        nome: string
        sobrenome: string
      }
    }
  }
  id: number
  cargo: string
  grupo_financeiro_usuarioId: number
  recusado: boolean
  pendente: boolean
  usuarioDestinoId: number
  grupoFinanceiroId: number
}

export interface Membro {
  usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info: {
    email: string
    usuario: {
      nome: string
      sobrenome: string
    }
  }
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  role: string
  id_usuario_info_cadastro: number
  id_usuario_info: number
  id_grupo_financeiro: number
}
