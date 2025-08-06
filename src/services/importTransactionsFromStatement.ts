// src/services/importTransactionsFromStatement.ts

import { Statement } from '@/models/statements'
import Transaction from '@/models/transactions'
import mongoose from 'mongoose'

export async function importTransactionsFromStatement(statementId: string, userId: string) {
  // Conectar ao MongoDB se necessário
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!)
  }

  const statement = await Statement.findById(statementId)

  if (!statement) {
    throw new Error(`Statement com ID ${statementId} não encontrado`)
  }

  // Extrai todos os fitids do statement
  const allFitids = statement.transactions.map((t: any) => t.fitid).filter(Boolean)

  // Busca transações já importadas com base no fitid e user_id
  const existingTransactions = await Transaction.find({
    user_id: userId,
    fitid: { $in: allFitids },
  })

  const existingFitids = new Set(existingTransactions.map((t) => t.fitid))

  // Filtra apenas as transações novas (fitid ainda não existente)
  const newTransactions = statement.transactions.filter(
    (t: any) => t.fitid && !existingFitids.has(t.fitid)
  )

  if (newTransactions.length === 0) {
    return {
      insertedCount: 0,
      skipped: allFitids.length,
      message: 'Nenhuma transação nova para importar.',
    }
  }

  const transactionsToInsert = newTransactions.map((t: any) => ({
    description: t.memo || 'Sem descrição',
    payment_method: t.payment_method || statement.payment_method || 'desconhecido',
    amount: t.amount,
    type: t.trntype?.toLowerCase() === 'credit' ? 'income' : 'expense',
    category: 'Sem categoria',
    due_date: t.date,
    payment_date: null,
    status: 'pendente',
    notes: '', // Pode adicionar t.memo aqui também, se quiser manter
    recurring: false,
    created_at: new Date(),
    user_id: userId,
    fitid: t.fitid,
  }))

  const inserted = await Transaction.insertMany(transactionsToInsert)

  return {
    insertedCount: inserted.length,
    skipped: existingFitids.size,
    statementId,
  }
}
