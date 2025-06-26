export interface SaidaCategoria {
  id: number
  nome: string
  dthr_cadastro: string
  id_ativo: boolean
  id_patrimonial: boolean
  id_usuario_info_cadastro: number
  id_grupo_financeiro: number
}

export interface TipoSaida {
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  id_usuario_info_cadastro: number
  id_grupo_financeiro: number
  nome: string
}

export interface SaidaPrioridade {
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  id_usuario_info_cadastro: number | null
  nome: string
  nivel: number
}

export interface EntradaCategoria {
  id: number
  nome: string
  dthr_cadastro: string
  id_ativo: boolean
  id_patrimonial: boolean
  id_usuario_info_cadastro: number
  id_grupo_financeiro: number
}

export interface TipoEntrada {
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  id_usuario_info_cadastro: number
  id_grupo_financeiro: number
  nome: string
}

export interface CreateSaidaRequest {
  nome: string
  dthr_saida: string | null
  id_saida_categoria: number
  id_pagamento_saida_tipo: number
  id_saida_prioridade: number
  id_usuario_info: number
  id_periodicidade: number
  valor: number
  id_patrimonio_info?: number | null
}

export interface CreateEntradaRequest {
  nome: string
  dthr_entrada: string | null
  id_entrada_categoria: number
  id_pagamento_entrada_tipo: number
  id_usuario_info: number
  id_periodicidade: number
  valor: string
  id_patrimonio_info?: number | null
  comprovante: number
}

export interface Saida {
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  dthr_saida: string | null
  id_saida_categoria: number
  id_pagamento_saida_tipo: number
  id_usuario_info_cadastro: number
  id_saida: number
  id_info_ativo: boolean
  id_saida_prioridade: number
  id_usuario_info: number
  id_periodicidade: number
  valor: string
  id_patrimonio_info: number | null
  comprovante: any
  patrimonio_infoId: any
  saida?: {
    id: number
    nome: string
  }
  usuario_info_saida_info_id_usuario_info_cadastroTousuario_info?: {
    usuario: {
      nome: string
      cpf: string
    }
    email: string
    id: number
  }
}

export interface Entrada {
  id: number
  dthr_cadastro: string
  dthr_entrada: string | null
  id_usuario_info_cadastro: number
  id_info_ativo: boolean
  id_ativo: boolean
  id_entrada: number
  id_entrada_categoria: number
  id_pagamento_entrada_tipo: number
  id_usuario_info: number
  id_periodicidade: number
  valor: string
  id_patrimonio_info: number | null
  comprovante: any
  patrimonio_infoId: any
  entrada?: {
    id: number
    nome: string
  }
  usuario_info_entrada_info_id_usuario_info_cadastroTousuario_info?: {
    usuario: {
      nome: string
      cpf: string
    }
    email: string
    id: number
  }
}

export interface Metadata {
  gastoTotal: number
  gastoDoMes: number
  entradasTotais: number
  entradasMes: number
  gastosTotaisDoGrupo: number
  gastosTotaisDoGrupoMes: number
  entradasTotaisGrupo: number
  entradasTotaisGrupoMes: number
}

export interface SaidaCategoriasResponse {
  categoriasPadrao: SaidaCategoria[]
  categoriasDoUsuario: SaidaCategoria[]
}

export interface SaidaPrioridadesResponse {
  saidas: SaidaPrioridade[]
  saidasPublicas: SaidaPrioridade[]
}
