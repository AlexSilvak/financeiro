import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContaPagar from '@/models/contaPagar'

// 🔹 GET /api/contas-pagar?id=...
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const usuario_id = searchParams.get('usuario_id')

    const contas = await ContaPagar.find({ usuario_id }).sort({ vencimento: 1 })
    return NextResponse.json({ contas })
  } catch (error) {
    console.error('[ERRO_GET_CONTAS_PAGAR]', error)
    return NextResponse.json({ error: 'Erro ao buscar contas a pagar' }, { status: 500 })
  }
}

// 🔹 POST /api/contas-pagar
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const novaConta = await ContaPagar.create(body)
    return NextResponse.json(novaConta)
  } catch (error) {
    console.error('[ERRO_POST_CONTAS_PAGAR]', error)
    return NextResponse.json({ error: 'Erro ao criar conta a pagar' }, { status: 500 })
  }
}

// 🔹 PUT /api/contas-pagar/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const atualizada = await ContaPagar.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json(atualizada)
  } catch (error) {
    console.error('[ERRO_PUT_CONTAS_PAGAR]', error)
    return NextResponse.json({ error: 'Erro ao atualizar conta a pagar' }, { status: 500 })
  }
}

// 🔹 DELETE /api/contas-pagar/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const removida = await ContaPagar.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Conta removida com sucesso', removida })
  } catch (error) {
    console.error('[ERRO_DELETE_CONTAS_PAGAR]', error)
    return NextResponse.json({ error: 'Erro ao deletar conta a pagar' }, { status: 500 })
  }
}
