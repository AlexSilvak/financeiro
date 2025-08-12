import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Transactions } from '@/models/transactions'

function extractValue(text: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([^<\r\n]+)`)
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

function parseOfxDate(dateStr: string): Date {
  const clean = dateStr.trim().slice(0, 8)
  const year = clean.slice(0, 4)
  const month = clean.slice(4, 6)
  const day = clean.slice(6, 8)
  return new Date(`${year}-${month}-${day}T00:00:00`)
}

function extractTransactions(text: string) {
  const trxRegex = /<STMTTRN>[\s\S]*?<\/STMTTRN>/g
  const trxBlocks = text.match(trxRegex) || []

  return trxBlocks.map((block) => ({
    trntype: extractValue(block, 'TRNTYPE'),
    amount: parseFloat(extractValue(block, 'TRNAMT')),
    payment_method: extractValue(block, 'NAME'),
    date: parseOfxDate(extractValue(block, 'DTPOSTED')),
    memo: extractValue(block, 'MEMO'),
    fitid: extractValue(block, 'FITID'),
  }))
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file || !file.name.endsWith('.ofx')) {
      return NextResponse.json({ error: 'Envie um arquivo .ofx' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const text = Buffer.from(arrayBuffer).toString('utf8')

    const accountId = extractValue(text, 'ACCTID')
    const bankId = extractValue(text, 'BANKID')
    const branchId = extractValue(text, 'BRANCHID')
    const payment_method = extractValue(text, 'NAME')
    const transactions = extractTransactions(text)

    const newTransaction = await Transactions.create({
      account_id: accountId,
      bank_id: bankId,
      branch_id: branchId,
      payment_method,
      transactions,
      imported_at: new Date(),
    })

    return NextResponse.json({
      message: 'Extrato importado com sucesso',
      count: transactions.length,
      id: newTransaction._id,
    })
  } catch (err: any) {
    console.error('Erro ao processar arquivo OFX:', err)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const bank_id = searchParams.get('bank_id')
    const account_id = searchParams.get('account_id')

    const filter: Record<string, any> = {}
    if (bank_id) filter.bank_id = bank_id
    if (account_id) filter.account_id = account_id

    const transaction = await Transactions.find(filter)
      .sort({ imported_at: -1 })
      .limit(50)

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Erro no GET /transactions:', error)
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 })
  }
}
