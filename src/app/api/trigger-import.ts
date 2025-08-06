// src/api/trigger-import.ts (exemplo)

import { importQueue } from '@/queues/import-transactions-queue'

await importQueue.add('import-transactions', {
  statementId: 'abc123',
  userId: 'usuario123',
})
