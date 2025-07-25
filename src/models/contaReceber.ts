import { Schema, model, models, Document } from 'mongoose'

export interface IContaReceber extends Document {
  descricao: string
  valor: number
  vencimento: Date
  recebimento?: Date
  status: 'pendente' | 'recebida' | 'atrasada'
  categoria_id: string
  cliente_id?: string
  usuario_id: string
  forma_recebimento?: string
  observacao?: string
  recorrente?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ContaReceberSchema = new Schema<IContaReceber>(
  {
    descricao: { type: String, required: true },
    valor: { type: Number, required: true },
    vencimento: { type: Date, required: true },
    recebimento: { type: Date },
    status: {
      type: String,
      enum: ['pendente', 'recebida', 'atrasada'],
      default: 'pendente',
    },
    categoria_id: { type: String, required: true },
    cliente_id: { type: String, default: null },
    usuario_id: { type: String, required: true },
    forma_recebimento: { type: String },
    observacao: { type: String },
    recorrente: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default models.ContaReceber || model<IContaReceber>('ContaReceber', ContaReceberSchema)
