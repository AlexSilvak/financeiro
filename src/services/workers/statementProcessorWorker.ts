// src/services/workers/statementProcessorWorker.ts
import { Worker, Job } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis()

const worker = new Worker(
  'statementProcessor',
  async (job: Job) => {
    console.log(`Processando statement ${job.name}`)
    // lógica para transformar statement em transações
  },
  { connection }
)

worker.on('completed', job => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed`, err)
})
