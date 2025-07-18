import { NextRequest, NextResponse } from 'next/server'
import ContaBancaria from '@/lib/models/conta-bancaria'
import { dbConnect } from '@/lib/mongodb'

export async function GET() {
  await dbConnect()
  const contas = await ContaBancaria.find().populate('banco_id')
  return NextResponse.json(contas)
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const data = await req.json()
  const conta = await ContaBancaria.create(data)
  return NextResponse.json(conta, { status: 201 })
}
