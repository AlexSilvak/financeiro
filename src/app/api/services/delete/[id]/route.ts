import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Service from '@/models/service'
import { Queue, Job } from 'bullmq'
import { redis } from '@/lib/redis'

const queue = new Queue('service-jobs', { connection: redis })

export async function DELETE(
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

    // Remover jobs relacionados na fila BullMQ
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
        console.log(`Job removido da fila para serviço ${id}`)
      }
    }

    // Remover serviço no MongoDB
    await service.deleteOne()

    return NextResponse.json({ message: 'Serviço removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover serviço:', error)
    return NextResponse.json(
      { error: 'Erro ao remover serviço', details: `${error}` },
      { status: 500 }
    )
  }
}
