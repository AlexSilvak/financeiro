import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'ofx-js'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const ofxText = Buffer.from(arrayBuffer).toString('utf-8')

    const { OFX } = parse(ofxText)

    const transactions =
      OFX.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN ?? []

    const extrato = transactions.map((t: any) => ({
      tipo: t.TRNTYPE,
      data: t.DTPOSTED,
      valor: parseFloat(t.TRNAMT),
      descricao: t.MEMO,
      id: t.FITID,
    }))

    return NextResponse.json({ sucesso: true, extrato }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao processar OFX:', error)
    return NextResponse.json({ erro: 'Falha ao processar OFX' }, { status: 500 })
  }
}
