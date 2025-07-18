import mongoose, { Schema, Document } from 'mongoose'

export interface IBanco extends Document {
  nome: string
  codigo_banco: string
  agencia: string
  endereco?: string
  contato?: string
}

const BancoSchema: Schema<IBanco> = new Schema({
  nome: { type: String, required: true },
  codigo_banco: { type: String, required: true },
  agencia: { type: String, required: true },
  endereco: { type: String },
  contato: { type: String },
}, { timestamps: true })

export default mongoose.models.Banco || mongoose.model<IBanco>('Banco', BancoSchema)
