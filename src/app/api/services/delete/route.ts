import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'
import { Queue, Job } from 'bullmq'
import { redis } from '@/lib/redis'

export async function DELETE(req: Request) {
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

    // Remove jobs relacionados da fila BullMQ
    const queue = new Queue('service-jobs', { connection: redis })
    const jobs: Job[] = await queue.getJobs([
      'waiting',
      'active',
      'delayed',
      'failed',
      'paused'
    ])

    for (const job of jobs) {
      if (job.data?.serviceId === id) {
        await job.remove()
      }
    }

    // Remove o serviço do MongoDB
    await service.deleteOne()

    return NextResponse.json({ message: 'Serviço removido com sucesso' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover serviço', details: `${error}` },
      { status: 500 }
    )
  }
}
