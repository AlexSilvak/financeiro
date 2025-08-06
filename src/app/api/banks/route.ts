import { NextRequest, NextResponse } from 'next/server'
import Bank from '@/models/bank'
import { connectDB } from '@/lib/mongodb'; 

export async function GET() {
  await connectDB()
  const Banks = await Bank.find()
  return NextResponse.json(Banks)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const data = await req.json()
  const novoBank = await Bank.create(data)
  return NextResponse.json(novoBank, { status: 201 })
}

