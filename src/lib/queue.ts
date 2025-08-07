// lib/queue.ts
import { Queue } from 'bullmq'
import { redis } from './redis' // redis: Redis connection client

export const serviceQueue = new Queue('service-jobs', { connection: redis })
