import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(_req: Request, { params }: RouteParams) {
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

    // Atualiza status no MongoDB
    service.status = 'running'
    service.log_service = 'Serviço iniciado manualmente'
    await service.save()

    return NextResponse.json({ message: 'Serviço iniciado com sucesso' })
  } catch (error) {
    console.error('Erro ao iniciar serviço:', error)
    return NextResponse.json({ error: 'Erro ao iniciar serviço', details: `${error}` }, { status: 500 })
  }
}
