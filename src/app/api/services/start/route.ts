import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'
// import { queue } from '@/lib/bullmq' // se houver integração com BullMQ

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

    // Atualiza status no MongoDB
    service.status = 'running'
    service.log_service = 'Serviço iniciado manualmente'
    await service.save()

    // (Opcional) Enfileirar job no BullMQ
    // await queue.add('process-service', { serviceId: id })

    return NextResponse.json({ message: 'Serviço iniciado com sucesso' })
  } catch (error) {
    console.error('Erro ao iniciar serviço:', error)
    return NextResponse.json({ error: 'Erro ao iniciar serviço', details: `${error}` }, { status: 500 })
  }
}
