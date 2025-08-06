// scripts/test-import.ts

import dotenv from 'dotenv'
dotenv.config()

import { importTransactionsFromStatement } from '@/services/importTransactionsFromStatement'

async function run() {
  const statementId = 'COLA_O_ID_DO_STATEMENT_AQUI'
  const userId = 'user123' // Substitua pelo ID do usuário logado ou fake

  try {
    const result = await importTransactionsFromStatement(statementId, userId)
    console.log('Resultado da importação:')
    console.log(result)
  } catch (err) {
    console.error('Erro ao importar transações:', err)
  } finally {
    process.exit(0)
  }
}

run()
