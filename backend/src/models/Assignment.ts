import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  className: string;
  dueDate?: string;
  questionTypes: IQuestionType[];
  additionalInfo?: string;
  fileText?: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  result?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    dueDate: String,
    questionTypes: [{ type: { type: String }, count: Number, marks: Number }],
    additionalInfo: String,
    fileText: String,
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'done', 'failed'],
    },
    result: { type: mongoose.Schema.Types.Mixed, default: undefined },
    error: String,
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);