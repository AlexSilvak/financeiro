import { Redis } from 'ioredis';

export const redis = new Redis({
  host: '127.0.0.1', // ou use 'redis' se estiver no mesmo docker-compose
  port: 6379,
});
