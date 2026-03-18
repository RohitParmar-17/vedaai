import { Queue } from 'bullmq';

const url = new URL(process.env.REDIS_URL!);

export const redisConnection = {
  host: url.hostname,
  port: Number(url.port),
  password: url.password,
  username: url.username || 'default',
  maxRetriesPerRequest: null as any,
  enableReadyCheck: false,
};

export const assignmentQueue = new Queue('assignment-generation', {
  connection: redisConnection,
});