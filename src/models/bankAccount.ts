import { Schema, Document, model, models } from 'mongoose'

export interface IBankAccount extends Document {
  agency: Schema.Types.ObjectId
  account_number: string
  manager?: string
  status: string
}

const BankAccountSchema = new Schema<IBankAccount>(
  {
    agency: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    account_number: { type: String, required: true },
    manager: { type: String },
    status: { type: String, required: true },
  },
  { timestamps: true }
)

const BankAccount = models.BankAccount || model<IBankAccount>('BankAccount', BankAccountSchema)
export default BankAccount
