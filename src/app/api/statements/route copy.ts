// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Transaction from '@/models/transactions' // ← agora usamos o model de transactions

// Extrai o conteúdo de uma tag específica
function extractValue(text: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([^<\r\n]+)`)
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

// Converte data OFX para Date JS
function parseOfxDate(dateStr: string): Date {
  const clean = dateStr.trim().slice(0, 8)
  const year = clean.slice(0, 4)
  const month = clean.slice(4, 6)
  const day = clean.slice(6, 8)
  return new Date(`${year}-${month}-${day}T00:00:00`)
}

// Extrai os lançamentos do OFX
function extractTransactions(text: string, extraData: any) {
  const trxRegex = /<STMTTRN>[\s\S]*?<\/STMTTRN>/g
  const trxBlocks = text.match(trxRegex) || []

  return trxBlocks.map((block) => ({
    trntype: extractValue(block, 'TRNTYPE'),
    amount: parseFloat(extractValue(block, 'TRNAMT')),
    payment_method: extractValue(block, 'NAME'),
    date: parseOfxDate(extractValue(block, 'DTPOSTED')),
    memo: extractValue(block, 'MEMO'),
    fitid: extractValue(block, 'FITID'),
    account_id: extraData.account_id,
    bank_id: extraData.bank_id,
    branch_id: extraData.branch_id,
    imported_at: new Date(),
  }))
}

// POST - Importa OFX para a coleção transactions
export async function POST(req: NextRequest) {
  await connectDB()

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || !file.name.endsWith('.ofx')) {
    return NextResponse.json({ error: 'Envie um arquivo .ofx' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const text = Buffer.from(arrayBuffer).toString('utf8')

  const account_id = extractValue(text, 'ACCTID')
  const bank_id = extractValue(text, 'BANKID')
  const branch_id = extractValue(text, 'BRANCHID')

  const transactions = extractTransactions(text, { account_id, bank_id, branch_id })

  // Salva todas as transações como documentos individuais
  const created = await Transaction.insertMany(transactions)

  return NextResponse.json({
    message: 'Transações importadas com sucesso',
    count: created.length,
  })
}

// GET - Busca transações direto na collection transactions
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const bank_id = searchParams.get('bank_id')
    const account_id = searchParams.get('account_id')
    const trntype = searchParams.get('trntype')
    const fitid = searchParams.get('fitid')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const filter: Record<string, any> = {}
    if (bank_id) filter.bank_id = bank_id
    if (account_id) filter.account_id = account_id
    if (trntype) filter.trntype = trntype
    if (fitid) filter.fitid = fitid

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(limit)

    return NextResponse.json(transactions)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 })
  }
}
