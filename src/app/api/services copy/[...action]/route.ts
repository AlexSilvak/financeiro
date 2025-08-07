// src/app/api/services/[...action]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Queue, Worker, QueueScheduler, Job } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379')

const queues: Record<string, Queue> = {}

function getQueue(serviceName: string) {
  if (!queues[serviceName]) {
    queues[serviceName] = new Queue(serviceName, { connection })
    new QueueScheduler(serviceName, { connection }) // evita jobs travados
  }
  return queues[serviceName]
}

export async function POST(req: NextRequest, { params }: { params: { action: string[] } }) {
  const [serviceName, action] = params.action || []

  if (!serviceName || !action) {
    return NextResponse.json({ error: 'Serviço e ação são obrigatórios' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const queue = getQueue(serviceName)

  try {
    switch (action) {
      case 'create':
        if (!body.name || !body.data) {
          return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
        }

        const job = await queue.add(body.name, body.data)
        return NextResponse.json({ message: 'Job criado', jobId: job.id })

      case 'start':
        // Start seria adicionar um job genérico de teste
        const started = await queue.add('manual-start', { timestamp: Date.now() })
        return NextResponse.json({ message: 'Job iniciado', jobId: started.id })

      case 'stop':
        await queue.pause()
        return NextResponse.json({ message: 'Serviço pausado' })

      case 'restart':
        await queue.resume()
        return NextResponse.json({ message: 'Serviço reiniciado' })

      case 'drop':
        await queue.drain()
        await queue.clean(0, 1000, 'completed')
        await queue.clean(0, 1000, 'failed')
        return NextResponse.json({ message: 'Serviço limpo' })

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (err: any) {
    console.error('Erro BullMQ:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
