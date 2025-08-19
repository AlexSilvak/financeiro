import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Bank from '@/models/bank'
import { z } from 'zod'

// Validação parcial (para atualização)
const updateSchema = z.object({
  ispb: z.string().length(8).optional(),
  code: z.number().int().nonnegative().optional(),
  name: z.string().min(2).optional(),
  fullName: z.string().min(2).optional(),
  status: z.enum(['ativo', 'inativo']).optional(),
})

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const bank = await Bank.findById(params.id)
  if (!bank) return NextResponse.json({ error: 'Banco não encontrado' }, { status: 404 })
  return NextResponse.json(bank)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const body = await req.json()
  const bank = await Bank.findByIdAndUpdate(params.id, body, { new: true })
  if (!bank) return NextResponse.json({ error: 'Banco não encontrado' }, { status: 404 })
  return NextResponse.json(bank)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const bank = await Bank.findByIdAndDelete(params.id)
  if (!bank) return NextResponse.json({ error: 'Banco não encontrado' }, { status: 404 })
  return NextResponse.json({ message: 'Banco removido com sucesso' })
}