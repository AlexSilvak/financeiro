import { NextRequest, NextResponse } from 'next/server'
import { importQueue } from '@/queues/import-transactions-queue'
import { QueueEvents, Job } from 'bullmq'

const queueName = 'import-transactions'

export async function POST(req: NextRequest) {
  const { statementId, userId } = await req.json()

  if (!statementId || !userId) {
    return NextResponse.json({ error: 'statementId e userId são obrigatórios' }, { status: 400 })
  }

  await importQueue.add(queueName, { statementId, userId })

  return NextResponse.json({ status: 'started', statementId })
}

export async function PUT(req: NextRequest) {
  const { statementId, userId } = await req.json()

  if (!statementId || !userId) {
    return NextResponse.json({ error: 'statementId e userId são obrigatórios' }, { status: 400 })
  }

  // Apagar qualquer job existente com a mesma statementId (em espera)
  const jobs = await importQueue.getJobs(['waiting', 'delayed', 'active'])
  const jobsToRemove = jobs.filter(
    (job: Job) => job.data.statementId === statementId && job.data.userId === userId
  )

  for (const job of jobsToRemove) {
    await job.remove()
  }

  // Adiciona novamente
  await importQueue.add(queueName, { statementId, userId })

  return NextResponse.json({ status: 'restarted', statementId })
}

export async function DELETE(req: NextRequest) {
  const { statementId, userId } = await req.json()

  if (!statementId || !userId) {
    return NextResponse.json({ error: 'statementId e userId são obrigatórios' }, { status: 400 })
  }

  const jobs = await importQueue.getJobs(['waiting', 'delayed', 'active'])
  const jobToRemove = jobs.find(
    (job: Job) => job.data.statementId === statementId && job.data.userId === userId
  )

  if (jobToRemove) {
    await jobToRemove.remove()
    return NextResponse.json({ status: 'stopped', statementId })
  }

  return NextResponse.json({ status: 'no-job-found', statementId })
}
