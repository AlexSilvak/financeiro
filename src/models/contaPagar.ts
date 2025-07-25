import { Schema, model, models, Document } from 'mongoose'

export interface IContaPagar extends Document {
  descricao: string
  valor: number
  vencimento: Date
  pagamento?: Date
  status: 'pendente' | 'paga' | 'atrasada'
  categoria_id: string
  fornecedor_id?: string
  usuario_id: string
  forma_pagamento?: string
  observacao?: string
  recorrente?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ContaPagarSchema = new Schema<IContaPagar>(
  {
    descricao: { type: String, required: true },
    valor: { type: Number, required: true },
    vencimento: { type: Date, required: true },
    pagamento: { type: Date },
    status: {
      type: String,
      enum: ['pendente', 'paga', 'atrasada'],
      default: 'pendente',
    },
    categoria_id: { type: String, required: true },
    fornecedor_id: { type: String, default: null },
    usuario_id: { type: String, required: true },
    forma_pagamento: { type: String },
    observacao: { type: String },
    recorrente: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default models.ContaPagar || model<IContaPagar>('ContaPagar', ContaPagarSchema)
