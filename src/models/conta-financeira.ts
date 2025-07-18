import mongoose, { Schema, Document } from 'mongoose'
import { ITerceiro } from '../models/terceiro'
import { IContaBancaria } from '../models/conta-bancaria'

export interface IContaFinanceira extends Document {
  descricao: string
  tipo: 'pagar' | 'receber'
  valor: number
  data_emissao: Date
  data_vencimento: Date
  data_pagamento?: Date
  fornecedor_cliente_id: ITerceiro['_id']
  conta_bancaria_id: IContaBancaria['_id']
  status: 'em_aberto' | 'pago' | 'vencido'
}

const ContaFinanceiraSchema: Schema<IContaFinanceira> = new Schema({
  descricao: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['pagar', 'receber'],
    required: true,
  },
  valor: { type: Number, required: true },
  data_emissao: { type: Date, required: true },
  data_vencimento: { type: Date, required: true },
  data_pagamento: { type: Date },
  fornecedor_cliente_id: {
    type: Schema.Types.ObjectId,
    ref: 'Terceiro',
    required: true,
  },
  conta_bancaria_id: {
    type: Schema.Types.ObjectId,
    ref: 'ContaBancaria',
    required: true,
  },
  status: {
    type: String,
    enum: ['em_aberto', 'pago', 'vencido'],
    default: 'em_aberto',
  },
}, { timestamps: true })

export default mongoose.models.ContaFinanceira || mongoose.model<IContaFinanceira>('ContaFinanceira', ContaFinanceiraSchema)
