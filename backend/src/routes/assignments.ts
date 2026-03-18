import { Router, Request, Response } from 'express';
import multer from 'multer';
import Assignment from '../models/Assignment';
import { assignmentQueue } from '../queues/assignmentQueue';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).select('-result -fileText');
    res.json(assignments);
  } catch {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    res.json(assignment);
  } catch {
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { title, subject, className, dueDate, questionTypes, additionalInfo } = req.body;

    let fileText = '';
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(req.file.buffer);
          fileText = data.text;
        } catch {}
      } else {
        fileText = req.file.buffer.toString('utf-8');
      }
    }

    const assignment = await Assignment.create({
      title,
      subject,
      className,
      dueDate,
      questionTypes: JSON.parse(questionTypes || '[]'),
      additionalInfo,
      fileText,
      status: 'pending',
    });

    await assignmentQueue.add('generate', { assignmentId: assignment._id.toString() });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndUpdate(req.params.id, {
      status: 'pending',
      result: undefined,
      error: undefined,
    });
    await assignmentQueue.add('generate', { assignmentId: req.params.id });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to regenerate' });
  }
});

export default router;