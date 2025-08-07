// src/app/api/services/[queue]/route.ts
import { statementProcessorQueue } from '@/services/queues/statementProcessorQueue'
import { NextResponse } from 'next/server'

export async function GET() {
  const jobs = await statementProcessorQueue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed'])
  return NextResponse.json(jobs.map(job => ({
    id: job.id,
    name: job.name,
    data: job.data,
    status: job.finishedOn ? 'completed' : (job.failedReason ? 'failed' : 'waiting'),
  })))
}

export async function POST(req: Request) {
  const body = await req.json()
  const job = await statementProcessorQueue.add(body.name, body.data)
  return NextResponse.json(job)
}
