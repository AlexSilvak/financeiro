// src/services/queues/statementProcessorQueue.ts
import { Queue } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis()

export const statementProcessorQueue = new Queue('statementProcessor', {
  connection,
})
