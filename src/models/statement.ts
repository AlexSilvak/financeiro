import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  trntype: String,
  amount: Number,
  date: Date,
  memo: String,
  fitid: String,
})

const statementSchema = new mongoose.Schema(
  {
    account_id: String,
    bank_id: String,
    branch_id: String,
    transactions: [transactionSchema],
    raw_ofx: String,
    imported_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'statements' }
)

export const Statement = mongoose.models.Statement || mongoose.model('Statement', statementSchema)
