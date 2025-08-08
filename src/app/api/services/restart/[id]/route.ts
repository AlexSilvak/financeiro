import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'
// import { Queue } from 'bullmq'
// import { redis } from '@/lib/redis'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    service.status = 'restarting'
    service.log_service = 'Serviço reiniciado manualmente'
    await service.save()

    // (Opcional) Reiniciar job na fila BullMQ
    /*
    const queue = new Queue('service-jobs', { connection: redis })
    await queue.add('restart-service', { serviceId: id })
    */

    return NextResponse.json({ message: 'Serviço reiniciado com sucesso' })
  } catch (error) {
    console.error('Erro ao reiniciar serviço:', error)
    return NextResponse.json(
      { error: 'Erro ao reiniciar serviço', details: `${error}` },
      { status: 500 }
    )
  }
}
