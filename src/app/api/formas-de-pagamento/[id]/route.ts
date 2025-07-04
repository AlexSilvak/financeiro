import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import FormaDePagamento from '@/models/formasDePagamento'

const MONGODB_URI = process.env.MONGODB_URI || ''

async function connectMongo() {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(MONGODB_URI)
  }
}

// GET uma forma de pagamento específica
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const forma = await FormaDePagamento.findById(params.id)
    if (!forma) {
      return NextResponse.json({ success: false, message: 'Não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: forma })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao buscar', error }, { status: 500 })
  }
}

// DELETE uma forma de pagamento
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    await FormaDePagamento.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true, message: 'Removido com sucesso' })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao deletar', error }, { status: 500 })
  }
}
