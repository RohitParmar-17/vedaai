const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface Question {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  type: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  dueDate?: string;
  questionTypes: QuestionType[];
  additionalInfo?: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  result?: {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: {
    title: string;
    instruction: string;
    questions: {
      text: string;
      difficulty: 'easy' | 'medium' | 'hard';
      marks: number;
      type: string;
      options?: string[];
      questionNumber?: number;
    }[];
  }[];
  answerKey: { questionNumber: number; answer: string }[];
};
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  async getAssignments(): Promise<Assignment[]> {
    const res = await fetch(`${BASE}/api/assignments`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },

  async getAssignment(id: string): Promise<Assignment> {
    const res = await fetch(`${BASE}/api/assignments/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },

  async createAssignment(formData: FormData): Promise<Assignment> {
    const res = await fetch(`${BASE}/api/assignments`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
  },

  async deleteAssignment(id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/assignments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
  },

  async regenerate(id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/assignments/${id}/regenerate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to regenerate');
  },
};