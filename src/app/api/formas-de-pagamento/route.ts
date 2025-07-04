import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import FormaDePagamento from '@/models/formasDePagamento'

const MONGODB_URI = process.env.MONGODB_URI || ''

// Função para conectar ao MongoDB
async function connectMongo() {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(MONGODB_URI)
  }
}

// GET: lista todas as formas de pagamento
export async function GET() {
  try {
    await connectMongo()
    const formas = await FormaDePagamento.find()
    return NextResponse.json({ success: true, data: formas })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar formas de pagamento', error },
      { status: 500 }
    )
  }
}

// POST: cria uma nova forma de pagamento
export async function POST(req: Request) {
  try {
    await connectMongo()
    const body = await req.json()
    const novaForma = await FormaDePagamento.create(body)
    return NextResponse.json({ success: true, data: novaForma }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao criar forma de pagamento', error },
      { status: 500 }
    )
  }
}
