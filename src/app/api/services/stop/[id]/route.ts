// src/app/api/services/stop/[id]/route.ts
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'

interface Params {
  params: { id: string }
}

export async function POST(req: Request, { params }: Params) {
  try {
    await connectDB()
    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const service = await Service.findById(id)
    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
    }

    service.status = 'stopped'
    service.log_service = 'Serviço interrompido manualmente'
    await service.save()

    return NextResponse.json({ message: 'Serviço interrompido com sucesso' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao parar serviço', details: String(error) },
      { status: 500 }
    )
  }
}
