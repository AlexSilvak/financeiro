import { Queue } from 'bullmq';
import { redis } from '../lib/redis';

export const jobQueue = new Queue('service-jobs', {
  connection: redis,
});
