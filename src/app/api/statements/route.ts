import { NextRequest, NextResponse } from 'next/server'
import { Statement } from '@/models/statement'
import { connectDB } from '@/lib/mongodb'

// Extrai o conteúdo de uma tag específica
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

// Extrai os blocos <STMTTRN> com regex e parseia os dados
function extractTransactions(text: string) {
  const trxRegex = /<STMTTRN>[\s\S]*?<\/STMTTRN>/g
  const trxBlocks = text.match(trxRegex) || []

  return trxBlocks.map((block) => ({
    trntype: extractValue(block, 'TRNTYPE'),
    amount: parseFloat(extractValue(block, 'TRNAMT')),
    payment_method: extractValue(block, 'NAME'),
    date: parseOfxDate(extractValue(block, 'DTPOSTED').substring(0, 8)), // YYYYMMDD
    memo: extractValue(block, 'MEMO'),
    fitid: extractValue(block, 'FITID'),
  }))
}

export async function POST(req: NextRequest) {
  await connectDB()

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || !file.name.endsWith('.ofx')) {
    return NextResponse.json({ error: 'Envie um arquivo .ofx' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const text = Buffer.from(arrayBuffer).toString('utf8')
 // importante: arquivos .ofx costumam vir em ISO-8859-1

  // Extração de metadados do extrato
  const accountId = extractValue(text, 'ACCTID')
  const bankId = extractValue(text, 'BANKID')
  const branchId = extractValue(text, 'BRANCHID')
  const transactions = extractTransactions(text)
   console.log(transactions)
  const newStatement = await Statement.create({
    account_id: accountId,
    bank_id: bankId,
    branch_id: branchId,
    transactions,
    raw_ofx: text,
  })

  return NextResponse.json({
    message: 'Extrato importado com sucesso',
    count: transactions.length,
    id: newStatement._id,
  })
}

export async function GET() {
  await connectDB()

  const statements = await Statement.find().sort({ imported_at: -1 }).limit(50)

  return NextResponse.json(statements)
}
