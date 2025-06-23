export interface Patrimonio {
  patrimonio: {
    nome: string
    valor_aquisicao: string
  }
  usuario_info?: {
    usuario: {
      nome: string
      cpf: string
    }
    email: string
  }
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  id_usuario_info_cadastro: number
  id_info_ativo: boolean
  valor_mercado: string
  id_patrimonio: number
}

export interface PatrimonioDetalhado {
  patrimonio: {
    nome: string
    valor_aquisicao: string
  }
  entrada_info: Array<{
    id_ativo: boolean
    id_periodicidade: number
    valor: string
  }>
  saida_info: Array<{
    id_ativo: boolean
    id_periodicidade: number
    valor: string
  }>
  id: number
  id_ativo: boolean
  dthr_cadastro: string
  id_usuario_info_cadastro: number
  id_info_ativo: boolean
  valor_mercado: string
  id_patrimonio: number
}

export interface CreatePatrimonioRequest {
  nome: string
  valor_aquisicao: number
  valor_mercado: number
}
