// models/Account.ts
import { Schema, Document, model, models } from 'mongoose'

export interface IAccount extends Document {
  bank: Schema.Types.ObjectId // referência ao banco
  account_number: string
  account_type: string // exemplo: "corrente", "poupança"
  holder_name: string
  holder_document: string // CPF ou CNPJ
  balance: number
  currency: string // exemplo: "BRL", "USD"
  status: string // exemplo: "ativo", "inativo"
}

const AccountSchema = new Schema<IAccount>(
  {
    bank: { type: Schema.Types.ObjectId, ref: 'Bank', required: true },
    account_number: { type: String, required: true },
    account_type: { type: String, required: true },
    holder_name: { type: String, required: true },
    holder_document: { type: String, required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'BRL' },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const Account = models.Account || model<IAccount>('Account', AccountSchema)
export default Account
