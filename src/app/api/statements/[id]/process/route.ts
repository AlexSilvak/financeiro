import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Statement } from '@/models/statement'
import { Transaction } from '@/models/transactions'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()

  const statement = await Statement.findById(params.id)

  if (!statement) {
    return NextResponse.json({ error: 'Extrato não encontrado' }, { status: 404 })
  }

  let inserted = 0
  let skipped = 0

  for (const trx of statement.transactions) {
    const exists = await Transaction.findOne({ fitid: trx.fitid })

    if (exists) {
      skipped++
      continue
    }

    await Transaction.create({
      description: trx.memo,
      amount: trx.amount,
      date: trx.date,
      type: trx.amount < 0 ? 'outcome' : 'income',
      fitid: trx.fitid,
    })

    inserted++
  }

  return NextResponse.json({
    message: 'Processamento concluído',
    total: statement.transactions.length,
    inserted,
    skipped,
  })
}
