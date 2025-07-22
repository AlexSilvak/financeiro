// models/banco.ts
import  { Schema, Document, model, models } from 'mongoose'

export interface IBanco extends Document {
  name: string
  bank_code: string
  agency: {
    number: string
    name?: string
    address?: string
    contact?: string
  }
  account_number: string
  manager: string
  sac: string
  fone: string
  email: string
  status: string
}

const BancoSchema = new Schema<IBanco>(
  {
    name: { type: String, required: true },
    bank_code: { type: String, required: true },

    agency: {
      number: { type: String},
      name: { type: String },
      address: { type: String },
      contact: { type: String },
    },

    account_number: { type: String },
    manager: { type: String},
    sac: { type: String},
    fone: { type: String},
    email: { type: String },

    status: { type: String, required: true }, // exemplo: "ativo", "inativo"
  },
  {
    timestamps: true,
  }
)

const Banco = models.Banco || model<IBanco>('Banco', BancoSchema)
export default Banco
