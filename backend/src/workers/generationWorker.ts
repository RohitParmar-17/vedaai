import { Worker } from 'bullmq';
import Assignment from '../models/Assignment';
import { generateQuestionPaper } from '../services/geminiService';
import { getIO } from '../socket';

const workerConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const initWorker = () => {
  const worker = new Worker(
    'assignment-generation',
    async (job) => {
      const { assignmentId } = job.data;
      const io = getIO();

      await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
      io.to(assignmentId).emit('status', { status: 'processing' });

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error('Assignment not found');

      const result = await generateQuestionPaper(assignment);

      await Assignment.findByIdAndUpdate(assignmentId, { status: 'done', result });
      io.to(assignmentId).emit('status', { status: 'done', assignmentId });
    },
    { connection: workerConnection }
  );

  worker.on('failed', async (job, err) => {
    console.error('JOB FAILED:', err.message, err.stack);
    if (!job) return;
    const io = getIO();
    await Assignment.findByIdAndUpdate(job.data.assignmentId, {
      status: 'failed',
      error: err.message,
    });
    io.to(job.data.assignmentId).emit('status', {
      status: 'failed',
      error: err.message,
    });
  });

  return worker;
};
