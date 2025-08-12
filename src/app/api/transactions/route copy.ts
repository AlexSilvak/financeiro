// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Transaction from '@/models/transactions'
import { connectDB } from '@/lib/mongodb'

// POST /api/transactions
export async function POST(req: NextRequest) {
  await connectDB()

  try {
    const body = await req.json()
    
    // Garantir que apenas campos válidos sejam inseridos
    const sanitizeTransaction = (tx: any) => ({
      description: tx.description,
      payment_method: tx.payment_method,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      due_date: tx.due_date || null,
      payment_date: tx.payment_date || null,
      status: tx.status || 'pendente',
      notes: tx.notes || '',
      recurring: tx.recurring || false,
      created_at: tx.created_at || new Date(),
      user_id: tx.user_id,
      bank_id: tx.bank_id || null,
      account_id: tx.account_id || null,
      trntype: tx.trntype || null,
      date: tx.date || null,
      memo: tx.memo || '',
      fitid: tx.fitid || null,
    })

    if (Array.isArray(body.transactions)) {
      const sanitized = body.transactions.map(sanitizeTransaction)
      const created = await Transaction.insertMany(sanitized)
      return NextResponse.json({
        message: 'Transações criadas com sucesso',
        count: created.length,
      }, { status: 201 })
    }

    const created = await Transaction.create(sanitizeTransaction(body))
    return NextResponse.json({
      message: 'Transação criada com sucesso',
      data: created,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar transações:', error)
    return NextResponse.json({
      error: error.message || 'Erro ao criar transações',
    }, { status: 500 })
  }
}

// GET /api/transactions
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')
    const bank_id = searchParams.get('bank_id')
    const account_id = searchParams.get('account_id')
    const trntype = searchParams.get('trntype')
    const fitid = searchParams.get('fitid')

    const filter: any = {}

    if (user_id) {
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
      }
      filter.user_id = user_id
    }
    if (bank_id) filter.bank_id = bank_id
    if (account_id) filter.account_id = account_id
    if (trntype) filter.trntype = trntype
    if (fitid) filter.fitid = fitid

    const transactions = await Transaction.find(filter).sort({ due_date: -1 })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    )
  }
}
