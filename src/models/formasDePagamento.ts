// src/models/formasDePagamento.ts

import mongoose, { Schema, Document } from 'mongoose'

// Representa o **meio** de pagamento: Pix, Dinheiro, Cartão etc.
export interface IFormasDePagamento extends Document {
  nome: string
  descricao?: string
  fixa?: boolean // true = padrão do sistema, false = criada pelo usuário
  usuario_id?: string
  data_criacao: Date
}

const FormasDePagamentoSchema: Schema = new Schema({
  nome: { type: String, required: true, trim: true },
  descricao: { type: String, trim: true, default: '' },
  fixa: { type: Boolean, default: false },
  usuario_id: { type: String, default: null },
  data_criacao: { type: Date, default: Date.now },
})

export default mongoose.models.FormaDePagamento ||
  mongoose.model<IFormasDePagamento>('FormaDePagamento', FormasDePagamentoSchema)
