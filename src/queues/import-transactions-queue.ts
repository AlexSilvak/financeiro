// src/queues/import-transactions-queue.ts

import { Queue } from 'bullmq'

export const importQueue = new Queue('import-transactions', {
  connection: { host: 'localhost', port: 6379 },
})
