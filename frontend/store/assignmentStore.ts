import { create } from 'zustand';

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

interface FormData {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInfo: string;
  file: File | null;
}

interface AssignmentStore {
  step: number;
  formData: FormData;
  setStep: (step: number) => void;
  updateForm: (data: Partial<FormData>) => void;
  addQuestionType: () => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (index: number, data: Partial<QuestionType>) => void;
  resetForm: () => void;
}

const defaultForm: FormData = {
  title: '',
  subject: '',
  className: '',
  dueDate: '',
  questionTypes: [{ type: 'Multiple Choice Questions', count: 4, marks: 1 }],
  additionalInfo: '',
  file: null,
};

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Fill in the Blanks',
  'True/False',
];

export { QUESTION_TYPE_OPTIONS };

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  step: 1,
  formData: { ...defaultForm },
  setStep: (step) => set({ step }),
  updateForm: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  addQuestionType: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: [
          ...state.formData.questionTypes,
          { type: 'Short Questions', count: 3, marks: 2 },
        ],
      },
    })),
  removeQuestionType: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.filter((_, i) => i !== index),
      },
    })),
  updateQuestionType: (index, data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: state.formData.questionTypes.map((qt, i) =>
          i === index ? { ...qt, ...data } : qt
        ),
      },
    })),
  resetForm: () => set({ step: 1, formData: { ...defaultForm } }),
}));