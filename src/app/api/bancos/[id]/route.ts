import { NextRequest, NextResponse } from 'next/server'
import Banco from '@/models/banco'
import { connectDB } from '@/lib/mongodb'


export async function GET() {
  await connectDB()
  const bancos = await Banco.find()
  return NextResponse.json(bancos)
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const data = await req.json()
  const bancoAtualizado = await Banco.findByIdAndUpdate(params.id, data, { new: true })
  if (!bancoAtualizado) {
    return NextResponse.json({ error: 'Banco não encontrado' }, { status: 404 })
  }
  return NextResponse.json(bancoAtualizado)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const bancoRemovido = await Banco.findByIdAndDelete(params.id)
  if (!bancoRemovido) {
    return NextResponse.json({ error: 'Banco não encontrado' }, { status: 404 })
  }
  return NextResponse.json({ message: 'Banco removido com sucesso' })
}
