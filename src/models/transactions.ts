import mongoose, { Schema, Document, models } from 'mongoose'

interface ITransaction {
  trntype: string
  amount: number
  payment_method:string
  date: Date
  memo?: string
  fitid: string
  user_id?: string;
}

export interface ITransactionDoc extends Document {
  account_id: string
  bank_id: string
  branch_id: string
  transactions: ITransaction[]
  imported_at: Date
  user_id?: string;
}

const transactionSchema = new Schema<ITransaction>({
  trntype: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_method:{ type: String, required: true },
  date: { type: Date, required: true },
  memo: { type: String, default: '' },
  fitid: { type: String, required: true, unique: true },
  user_id: { type: String, default: "" },
})

const transactionsSchema = new Schema<ITransactionDoc>(
  {
    account_id: { type: String, required: true },
    bank_id: { type: String, required: true },
    branch_id: { type: String, required: true },
    transactions: { type: [transactionSchema], default: [] },
    imported_at: { type: Date, default: Date.now },
    user_id: { type: String, default: "" },
  },
  { collection: 'transactions' }
)

export const Transactions =
  models.Transactions || mongoose.model<ITransactionDoc>('Transactions', transactionsSchema)
