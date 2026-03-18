import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { initSocket } from './socket';
import assignmentRoutes from './routes/assignments';
import { initWorker } from './workers/generationWorker';

const app = express();
const httpServer = createServer(app);

initSocket(httpServer);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/assignments', assignmentRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('MongoDB connected');
  initWorker();
  console.log('Worker initialized');
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => console.log(`Server on port ${PORT}`));
};

start().catch(console.error);