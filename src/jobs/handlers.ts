import { jobQueue } from '../queues/jobQueue';

export async function createJob(data: any) {
  return await jobQueue.add('processJob', data);
}

export async function dropJob(jobId: string) {
  const job = await jobQueue.getJob(jobId);
  if (job) await job.remove();
}

export async function restartJob(jobId: string) {
  const job = await jobQueue.getJob(jobId);
  if (job) {
    const data = job.data;
    await job.remove();
    return await jobQueue.add('processJob', data);
  }
}

export async function stopJob(jobId: string) {
  const job = await jobQueue.getJob(jobId);
  if (job) {
    await job.discard();
    await job.moveToFailed(new Error('Stopped manually'), true);
  }
}

export async function startJob(jobId: string) {
  const job = await jobQueue.getJob(jobId);
  if (job?.isFailed()) {
    await job.retry();
  }
}
