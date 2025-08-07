import { Worker } from 'bullmq';
import { redis } from '../lib/redis';

const worker = new Worker(
  'service-jobs',
  async job => {
    console.log(`🟡 Processando job ${job.id}:`, job.data);

    // Simula execução do job
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log(`✅ Job ${job.id} finalizado`);
    return { status: 'done' };
  },
  {
    connection: redis,
  }
);

// Eventos
worker.on('completed', job => {
  console.log(`🎉 Job ${job.id} concluído com sucesso`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} falhou:`, err.message);
});

// 🔄 Manter processo vivo
setInterval(() => {}, 1000);
