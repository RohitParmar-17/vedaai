import { Worker } from 'bullmq';
import Assignment from '../models/Assignment';
import { generateQuestionPaper } from '../services/geminiService';
import { getIO } from '../socket';

const url = new URL(process.env.REDIS_URL!);
const workerConnection = {
  host: url.hostname,
  port: Number(url.port),
  password: url.password,
  maxRetriesPerRequest: null as any,
  enableReadyCheck: false,
};

export const processDirectly = async (assignmentId: string) => {
  const io = getIO();
  try {
    console.log('Processing:', assignmentId);
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.status === 'done') return;

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    io.to(assignmentId).emit('status', { status: 'processing' });

    const result = await generateQuestionPaper(assignment);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'done', result });
    io.to(assignmentId).emit('status', { status: 'done', assignmentId });
    console.log('Done:', assignmentId);
  } catch (err: any) {
    console.error('FAILED:', err.message);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed', error: err.message });
    io.to(assignmentId).emit('status', { status: 'failed', error: err.message });
  }
};

export const initWorker = () => {
  const worker = new Worker(
    'assignment-generation',
    async (job) => {
      const { assignmentId } = job.data;
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment || assignment.status === 'done') return;
      await processDirectly(assignmentId);
    },
    { connection: workerConnection }
  );

  worker.on('failed', async (job, err) => {
    console.error('BullMQ JOB FAILED:', err.message);
  });

  console.log('BullMQ Worker initialized');
  return worker;
};