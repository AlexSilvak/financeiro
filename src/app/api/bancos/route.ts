import { NextRequest, NextResponse } from 'next/server'
import Banco from '@/models/banco'
import { connectDB } from '@/lib/mongodb'; 

export async function GET() {
  await dbConnect()
  const bancos = await Banco.find()
  return NextResponse.json(bancos)
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const data = await req.json()
  const novoBanco = await Banco.create(data)
  return NextResponse.json(novoBanco, { status: 201 })
}
