// services/statementToTransactions.ts

import { Statement } from '@/models/statements'
import TransactionModel from '@/models/transactions'
import { ITransaction } from '@/models/transactions'

export async function syncTransactionsFromStatements(userId: string) {
  const statements = await Statement.find({}).lean()

  for (const statement of statements) {
    for (const trx of statement.transactions) {
      const alreadyExists = await TransactionModel.findOne({ fitid: trx.fitid })

      if (alreadyExists) continue

      const newTransaction: Partial<ITransaction> = {
        description: trx.memo || trx.payment_method || 'Sem descrição',
        payment_method: trx.payment_method || 'Desconhecido',
        amount: Math.abs(trx.amount),
        type: trx.amount < 0 ? 'expense' : 'income',
        category: '', // opcional: categoria automática via palavras-chave
        due_date: trx.date,
        payment_date: trx.date,
        status: 'pago',
        created_at: new Date(),
        user_id: userId,
        notes: `Importado de statement ID ${statement._id}`,
        recurring: false,
      }

      await TransactionModel.create(newTransaction)
    }
  }

  return { message: 'Transações sincronizadas com sucesso' }
}
