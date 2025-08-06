// src/jobs/import-transactions.job.ts

import { Worker } from 'bullmq'
import { importTransactionsFromStatement } from '@/services/importTransactionsFromStatement'
import mongoose from 'mongoose'

new Worker(
  'import-transactions',
  async (job) => {
    const { statementId, userId } = job.data

    try {
      console.log(`Importando transações do statement: ${statementId}`)
      const result = await importTransactionsFromStatement(statementId, userId)
      console.log(`Importação concluída: ${result.insertedCount} transações inseridas.`)
    } catch (error) {
      console.error(`Erro ao importar transações:`, error)
      throw error
    }
  },
  {
    connection: { host: 'localhost', port: 6379 },
  }
)
