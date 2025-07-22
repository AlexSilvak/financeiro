import mongoose, { Schema, Document } from 'mongoose'
import { IBanco } from '../models/banco'

export interface IContaBancaria extends Document {
  descricao: string
  numero_conta: string
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'outro'
  agency_number: string
  operation_: string
  banco_id: IBanco['_id']
  saldo_inicial: number
  ativo: boolean
}

const ContaBancariaSchema: Schema<IContaBancaria> = new Schema(
  {
    descricao: { type: String, required: true },
    numero_conta: { type: String, required: true },
    tipo: {
      type: String,
      enum: ['corrente', 'poupanca', 'investimento', 'outro'],
      required: true,
    },
    agency_number: { type: String, default: '' },
    operation_: { type: String, default: '' },
    banco_id: {
      type: Schema.Types.ObjectId,
      ref: 'Banco',
      required: true,
    },
    saldo_inicial: { type: Number, default: 0 },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.ContaBancaria ||
  mongoose.model<IContaBancaria>('ContaBancaria', ContaBancariaSchema)
