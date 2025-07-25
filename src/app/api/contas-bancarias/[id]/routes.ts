import { NextRequest, NextResponse } from 'next/server'
import ContaBancaria from '@/models/conta-bancaria'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import Banco from '@/models/banco'
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const conta = await ContaBancaria.findByIdAndDelete(id)

    if (!conta) {
      return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Conta deletada com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro ao deletar conta:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const data = await req.json()

    // Se banco_id for enviado, valida existência
    if (data.banco_id) {
      const bancoExiste = await Banco.findById(data.banco_id)
      if (!bancoExiste) {
        return NextResponse.json({ error: 'Banco não encontrado' }, { status: 400 })
      }
    }

    const contaAtualizada = await ContaBancaria.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })

    if (!contaAtualizada) {
      return NextResponse.json({ error: 'Conta não encontrada' }, { status: 404 })
    }

    return NextResponse.json(contaAtualizada, { status: 200 })
  } catch (error) {
    console.error('Erro ao atualizar conta:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


