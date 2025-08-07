import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { id } = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const service = await Service.findById(id)
    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
    }

    service.status = 'running'
    service.log_service = 'Serviço restaurado manualmente'
    service.updated_at = new Date()

    await service.save()

    return NextResponse.json({ message: 'Serviço restaurado com sucesso' })
  } catch (error) {
    console.error('Erro ao restaurar serviço:', error)
    return NextResponse.json(
      { error: 'Erro ao restaurar serviço', details: `${error}` },
      { status: 500 }
    )
  }
}
