import { Queue } from 'bullmq';

export const redisConnection = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null as any,
  enableReadyCheck: false,
};

export const assignmentQueue = new Queue('assignment-generation', {
  connection: redisConnection,
});