// src/models/statements.ts

import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  trntype: String,
  amount: Number,
  payment_method: String,
  date: Date,
  memo: String,
  fitid: String,
})

const statementSchema = new mongoose.Schema(
  {
    account_id: String,
    bank_id: String,
    branch_id: String,
    payment_method: String,
    transactions: [transactionSchema],
    imported_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'statements', // <- Aqui você fixa a collection
  }
)

// Exporta apenas um model fixo para "statements"
export const Statement =
  mongoose.models.Statement || mongoose.model('Statement', statementSchema)
