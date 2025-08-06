import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'node-html-parser' // para SGML (OFX)
import { v4 as uuid } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file || !file.name.endsWith('.ofx')) {
      return NextResponse.json({ error: 'Apenas arquivos .ofx são permitidos' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const text = Buffer.from(arrayBuffer).toString('latin1')

    // Corrigir headers para permitir parsing
  function convertOFXtoXML(ofx: string) {
  const start = ofx.indexOf('<OFX>')
  if (start === -1) return ''

  const body = ofx.slice(start)

  // Corrige tags SGML para XML (fechando corretamente sem duplicar)
  const cleaned = body
    .replace(/<(\w+?)>([^<\r\n]+)/g, '<$1>$2</$1>') // fecha tags abertas
    .replace(/<\/(\w+)><\/\1>/g, '</$1>')           // remove duplicatas

  return cleaned
}



  const xml = convertOFXtoXML(text)
console.log('[DEBUG] XML convertido:', xml.slice(0, 1000)) // mostra o começo do XML
console.log(xml) // mostra o começo do XML
const root = parse(xml)
const stmtTrns = root.querySelectorAll('FITID') 
  
console.log('[DEBUG] Transações encontradas:', root)

    // Criar array de transações válidas
    const transactions = stmtTrns.map((node) => {
      const trntype = node.querySelector('TRNTYPE')?.text ?? ''
      const amount = parseFloat(node.querySelector('TRNAMT')?.text ?? '0')
      const dateRaw = node.querySelector('DTPOSTED')?.text ?? ''
      const memo = node.querySelector('MEMO')?.text ?? ''
       
      return {
        description: memo,
        payment_method: trntype,
        amount: Math.abs(amount),
        type: amount < 0 ? 'expense' : 'income',
        category: trntype,
        due_date: new Date(dateRaw),
        payment_date: new Date(dateRaw),
        status: 'pago',
        notes: '',
        recurring: false,
        user_id: '66a9c58fd13b8e0012abcd34', // fixo para testes
      }
    })


    
console.log(transactions)
    
 /**?
   const transactions = {
        description: "Teste X",
        payment_method: 'Cartão',
        amount:300,
        type: "expense",
        category: "Utilities",
        due_date:'2025-07-31T00:00:00.000Z',
        payment_date:'2025-07-31T00:00:00.000Z',
        status: 'pago',
        notes: 'Paid early to avoid penalty',
        recurring: false,
        user_id: '66a9c58fd13b8e0012abcd34'}
     
 */




    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions }),
    })

    if (!response.ok) {
      const err = await response.json()
      return NextResponse.json({ error: err }, { status: 500 })
    }

    return NextResponse.json({ message: 'Transações importadas com sucesso', count: transactions.length })
  } catch (err: any) {
    console.error('Erro ao processar OFX:', err)
    return NextResponse.json({ error: 'Erro ao processar arquivo OFX' }, { status: 500 })
  }
}
