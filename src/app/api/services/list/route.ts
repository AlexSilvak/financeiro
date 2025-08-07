import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'

export async function GET() {
  try {
    await connectDB()

    const services = await Service.find().sort({ created_at: -1 })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar serviços', details: `${error}` }, { status: 500 })
  }
}
