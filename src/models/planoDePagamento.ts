import mongoose, { Schema, Document, Types } from 'mongoose'

export type TipoPlano = 'venda' | 'compra'

export interface IParcela {
  numero: number
  dias_para_vencimento: number
  percentual: number
}

export interface IPlanoDePagamento extends Document {
  nome: string
  tipo_plano: TipoPlano
  forma_pagamento_id: Types.ObjectId // ref: FormaDePagamento
  permite_acoes_promocionais: boolean
  replicar_permissao_por_forma_pagamento: boolean
  parcelas: IParcela[]
  valor_minimo_parcela?: number
  taxa_financeira?: number // percentual
  indice_desconto_acrescimo?: number // obrigatório se parâmetro ativado
  fixa?: boolean
  usuario_id?: string
  data_criacao: Date
}

const ParcelaSchema = new Schema<IParcela>({
  numero: { type: Number, required: true },
  dias_para_vencimento: { type: Number, required: true },
  percentual: { type: Number, required: true },
})

const PlanoDePagamentoSchema = new Schema<IPlanoDePagamento>({
  nome: { type: String, required: true, trim: true },
  tipo_plano: { type: String, enum: ['venda', 'compra'], required: true },
  forma_pagamento_id: {
    type: Schema.Types.ObjectId,
    ref: 'FormaDePagamento',
    required: true,
  },
  permite_acoes_promocionais: { type: Boolean, default: false },
  replicar_permissao_por_forma_pagamento: { type: Boolean, default: false },
  parcelas: { type: [ParcelaSchema], required: true },
  valor_minimo_parcela: { type: Number, default: 0 },
  taxa_financeira: { type: Number, default: 0 },
  indice_desconto_acrescimo: { type: Number, default: null },
  fixa: { type: Boolean, default: false },
  usuario_id: { type: String, default: null },
  data_criacao: { type: Date, default: Date.now },
})

export default mongoose.models.PlanoDePagamento ||
  mongoose.model<IPlanoDePagamento>('PlanoDePagamento', PlanoDePagamentoSchema)
