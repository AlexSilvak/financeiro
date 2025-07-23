import { Schema, Document, model, models, Types } from 'mongoose'

export interface IFluxoCaixa extends Document {
  descricao: string
  tipo: 'entrada' | 'saida'
  valor: number
  forma_pagamento: string
  data: Date
  categoria?: string
  conta_bancaria?: Types.ObjectId // referência a conta bancária
  cliente?: Types.ObjectId // opcional
  fornecedor?: Types.ObjectId // opcional
  observacao?: string
  status: 'pendente' | 'pago' | 'cancelado'
  usuario: Types.ObjectId // usuário que lançou
}

const FluxoCaixaSchema = new Schema<IFluxoCaixa>(
  {
    descricao: { type: String, required: true },
    tipo: { type: String, enum: ['entrada', 'saida'], required: true },
    valor: { type: Number, required: true },
    forma_pagamento: { type: String, required: true },
    data: { type: Date, required: true },
    categoria: { type: String },
    conta_bancaria: { type: Schema.Types.ObjectId, ref: 'ContaBancaria' },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    fornecedor: { type: Schema.Types.ObjectId, ref: 'Fornecedor' },
    observacao: { type: String },
    status: { type: String, enum: ['pendente', 'pago', 'cancelado'], default: 'pendente' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  {
    timestamps: true,
  }
)

const FluxoCaixa = models.FluxoCaixa || model<IFluxoCaixa>('FluxoCaixa', FluxoCaixaSchema)
export default FluxoCaixa
