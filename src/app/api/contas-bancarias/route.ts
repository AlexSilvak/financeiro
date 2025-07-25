import { NextRequest, NextResponse } from 'next/server'
import ContaBancaria from '@/models/conta-bancaria'
import Banco from '@/models/banco'
import { connectDB } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()

    // Verifica campos obrigatórios
    const requiredFields = ['descricao', 'numero_conta', 'tipo', 'banco_id']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 })
      }
    }

    // ✅ Verifica se o banco_id existe
    const bancoExiste = await Banco.findById(data.banco_id)
    if (!bancoExiste) {
      return NextResponse.json({ error: 'Banco não encontrado com esse ID' }, { status: 400 })
    }

    // Cria a conta
    const conta = await ContaBancaria.create(data)
    return NextResponse.json(conta, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar conta bancária:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}



export async function GET() {
  try {
    await connectDB()
    const contas = await ContaBancaria.find().populate('banco_id')
    return NextResponse.json(contas, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar contas:', error)
    return NextResponse.json({ error: 'Erro ao buscar contas' }, { status: 500 })
  }
}

