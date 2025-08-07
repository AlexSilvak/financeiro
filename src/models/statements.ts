// src/models/statements.ts

import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  trntype: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, default: '' },
  date: { type: Date, required: true },
  memo: { type: String, default: '' },
  fitid: { type: String, required: true, unique: true },
})

const statementSchema = new mongoose.Schema(
  {
    account_id: { type: String, required: true },
    bank_id: { type: String, required: true },
    branch_id: { type: String, required: true },
    payment_method: { type: String, default: '' },
    transactions: { type: [transactionSchema], default: [] },
    imported_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'statements',
  }
)

// Exporta apenas um model fixo para "statements"
export const Statement =
  mongoose.models.Statement || mongoose.model('Statement', statementSchema)
