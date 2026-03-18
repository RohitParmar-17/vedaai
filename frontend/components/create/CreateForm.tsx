'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  X,
  Plus,
  Minus,
  ChevronDown,
  CalendarIcon,
  Mic,
} from 'lucide-react';
import { useAssignmentStore, QUESTION_TYPE_OPTIONS } from '@/store/assignmentStore';
import { api } from '@/lib/api';

export default function CreateForm() {
  const {
    step,
    formData,
    setStep,
    updateForm,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    resetForm,
  } = useAssignmentStore();

  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const totalQuestions = formData.questionTypes.reduce((s, qt) => s + qt.count, 0);
  const totalMarks = formData.questionTypes.reduce((s, qt) => s + qt.count * qt.marks, 0);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.className.trim()) e.className = 'Class is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (formData.questionTypes.length === 0) e.qt = 'Add at least one question type';
    formData.questionTypes.forEach((qt, i) => {
      if (qt.count <= 0) e[`count_${i}`] = 'Count must be > 0';
      if (qt.marks <= 0) e[`marks_${i}`] = 'Marks must be > 0';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('subject', formData.subject);
      fd.append('className', formData.className);
      fd.append('dueDate', formData.dueDate);
      fd.append('questionTypes', JSON.stringify(formData.questionTypes));
      fd.append('additionalInfo', formData.additionalInfo);
      if (formData.file) fd.append('file', formData.file);

      const assignment = await api.createAssignment(fd);
      resetForm();
      router.push(`/assignments/${assignment._id}`);
    } catch {
      setErrors({ submit: 'Failed to create assignment. Please try again.' });
    }
    setSubmitting(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) updateForm({ file });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <h1 className="text-base font-bold text-[#1C1917]">Create Assignment</h1>
        </div>
        <p className="text-xs text-gray-400 ml-4">Set up a new assignment for your students</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
        <div
          className="bg-[#1C1917] h-1 rounded-full transition-all duration-300"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-[#1C1917] mb-1">Basic Details</h2>
              <p className="text-xs text-gray-400">Provide basic information about your assignment.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Assignment Title *</label>
              <input
                type="text"
                placeholder="e.g. Quiz on Electricity"
                value={formData.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.title ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-brand'
                }`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Science, Mathematics"
                value={formData.subject}
                onChange={(e) => updateForm({ subject: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.subject ? 'border-red-400' : 'border-gray-200 focus:border-brand'
                }`}
              />
              {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Class *</label>
              <input
                type="text"
                placeholder="e.g. Class 8, Grade 10"
                value={formData.className}
                onChange={(e) => updateForm({ className: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.className ? 'border-red-400' : 'border-gray-200 focus:border-brand'
                }`}
              />
              {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-[#1C1917] mb-1">Assignment Details</h2>
              <p className="text-xs text-gray-400">Basic information about your assignment.</p>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-brand bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateForm({ file });
                }}
              />
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              {formData.file ? (
                <p className="text-sm font-medium text-brand">{formData.file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-xs text-gray-400 mb-3">JPEG, PNG, upto 10MB</p>
                  <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                    Browse Files
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center -mt-3">
              Upload images of your preferred document/image
            </p>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateForm({ dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand transition-colors appearance-none"
                  placeholder="Choose a chapter"
                />
                <CalendarIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="grid grid-cols-[1fr_80px_80px] gap-3 text-xs font-medium text-gray-500 flex-1 mr-8">
                  <span>Question Type</span>
                  <span className="text-center">No. of Questions</span>
                  <span className="text-center">Marks</span>
                </div>
              </div>

              {errors.qt && <p className="text-xs text-red-500 mb-2">{errors.qt}</p>}

              <div className="space-y-3">
                {formData.questionTypes.map((qt, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_80px] gap-3 items-center">
                    <div className="relative">
                      <select
                        value={qt.type}
                        onChange={(e) => updateQuestionType(i, { type: e.target.value })}
                        className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand appearance-none bg-white"
                      >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuestionType(i, { count: Math.max(1, qt.count - 1) })}
                        className="px-2 py-2 text-gray-500 hover:bg-gray-50 text-xs font-bold"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="flex-1 text-center text-xs font-medium">{qt.count}</span>
                      <button
                        onClick={() => updateQuestionType(i, { count: qt.count + 1 })}
                        className="px-2 py-2 text-gray-500 hover:bg-gray-50 text-xs font-bold"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-1">
                        <button
                          onClick={() => updateQuestionType(i, { marks: Math.max(1, qt.marks - 1) })}
                          className="px-2 py-2 text-gray-500 hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="flex-1 text-center text-xs font-medium">{qt.marks}</span>
                        <button
                          onClick={() => updateQuestionType(i, { marks: qt.marks + 1 })}
                          className="px-2 py-2 text-gray-500 hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      {formData.questionTypes.length > 1 && (
                        <button
                          onClick={() => removeQuestionType(i)}
                          className="ml-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addQuestionType}
                className="flex items-center gap-2 mt-3 text-xs text-gray-600 font-medium hover:text-brand transition-colors"
              >
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <Plus size={10} className="text-white" />
                </div>
                Add Question Type
              </button>

              <div className="flex justify-end gap-4 mt-3 text-xs text-gray-500">
                <span>Total Questions : <strong className="text-[#1C1917]">{totalQuestions}</strong></span>
                <span>Total Marks : <strong className="text-[#1C1917]">{totalMarks}</strong></span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Additional Information (For better output)
              </label>
              <div className="relative">
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateForm({ additionalInfo: e.target.value })}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand transition-colors resize-none pr-10"
                />
                <Mic size={16} className="absolute right-3 bottom-3 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>

            {errors.submit && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors.submit}</p>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-[210px] bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => (step === 1 ? router.push('/assignments') : setStep(1))}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </button>
        {step === 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white rounded-full text-sm font-medium hover:bg-[#2d2926] transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white rounded-full text-sm font-medium hover:bg-[#2d2926] disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Next →'
            )}
          </button>
        )}
      </div>
    </div>
  );
}