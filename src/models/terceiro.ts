import mongoose, { Schema, Document } from 'mongoose'

export interface ITerceiro extends Document {
  nome_razao_social: string
  tipo: 'fornecedor' | 'cliente' | 'ambos'
  cnpj_cpf: string
  endereco: string
  telefone?: string
  email?: string
  dados_bancarios?: string
}

const TerceiroSchema: Schema<ITerceiro> = new Schema({
  nome_razao_social: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['fornecedor', 'cliente', 'ambos'],
    required: true,
  },
  cnpj_cpf: { type: String, required: true },
  endereco: { type: String, required: true },
  telefone: { type: String },
  email: { type: String },
  dados_bancarios: { type: String },
}, { timestamps: true })

export default mongoose.models.Terceiro || mongoose.model<ITerceiro>('Terceiro', TerceiroSchema)
