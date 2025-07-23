import { Schema, Document, model, models, Types } from 'mongoose'

export interface IFechamentoCaixa extends Document {
  data: Date
  saldo_inicial: number
  total_entradas: number
  total_saidas: number
  saldo_final: number
  usuario: Types.ObjectId
  observacao?: string
  detalhes?: {
    descricao: string
    valor: number
    tipo: 'entrada' | 'saida'
    categoria?: string
  }[]
}

const FechamentoCaixaSchema = new Schema<IFechamentoCaixa>(
  {
    data: { type: Date, required: true, unique: true },
    saldo_inicial: { type: Number, required: true },
    total_entradas: { type: Number, required: true },
    total_saidas: { type: Number, required: true },
    saldo_final: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    observacao: { type: String },
    detalhes: [
      {
        descricao: { type: String },
        valor: { type: Number },
        tipo: { type: String, enum: ['entrada', 'saida'] },
        categoria: { type: String },
      }
    ],
  },
  {
    timestamps: true,
  }
)

const FechamentoCaixa =
  models.FechamentoCaixa || model<IFechamentoCaixa>('FechamentoCaixa', FechamentoCaixaSchema)

export default FechamentoCaixa
