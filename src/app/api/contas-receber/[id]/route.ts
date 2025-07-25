import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContaReceber from '@/models/contaReceber'

// 🔹 GET /api/contas-receber?usuario_id=...
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const usuario_id = searchParams.get('usuario_id')

    const contas = await ContaReceber.find({ usuario_id }).sort({ vencimento: 1 })
    return NextResponse.json({ contas })
  } catch (error) {
    console.error('[ERRO_GET_CONTAS_RECEBER]', error)
    return NextResponse.json({ error: 'Erro ao buscar contas a receber' }, { status: 500 })
  }
}

// 🔹 POST /api/contas-receber
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const novaConta = await ContaReceber.create(body)
    return NextResponse.json(novaConta)
  } catch (error) {
    console.error('[ERRO_POST_CONTAS_RECEBER]', error)
    return NextResponse.json({ error: 'Erro ao criar conta a receber' }, { status: 500 })
  }
}

// 🔹 PUT /api/contas-receber/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const atualizada = await ContaReceber.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json(atualizada)
  } catch (error) {
    console.error('[ERRO_PUT_CONTAS_RECEBER]', error)
    return NextResponse.json({ error: 'Erro ao atualizar conta a receber' }, { status: 500 })
  }
}

// 🔹 DELETE /api/contas-receber/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const removida = await ContaReceber.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Conta removida com sucesso', removida })
  } catch (error) {
    console.error('[ERRO_DELETE_CONTAS_RECEBER]', error)
    return NextResponse.json({ error: 'Erro ao deletar conta a receber' }, { status: 500 })
  }
}
