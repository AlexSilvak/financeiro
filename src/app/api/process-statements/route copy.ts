// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

// Modelo Statements (usando a mesma conexão)
const StatementSchema = new mongoose.Schema({}, { strict: false })
const Statement = mongoose.models.Statement || mongoose.model('Statement', StatementSchema, 'statements')

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const account_id = searchParams.get('account_id')
    const trntype = searchParams.get('trntype')

    const match: any = {}
    if (account_id) match.account_id = account_id
    if (trntype) match['transactions.trntype'] = trntype

    const result = await Statement.aggregate([
      { $match: match },
      { $unwind: '$transactions' },
      { $replaceRoot: { newRoot: '$transactions' } }, // retorna só as transactions
      { $sort: { date: -1 } }
    ])

    return NextResponse.json({ transactions: result })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    )
  }
}
