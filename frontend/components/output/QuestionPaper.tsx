"use client";

import { Assignment } from "@/lib/api";

interface Props {
  assignment: Assignment;
}

const difficultyStyle = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function QuestionPaper({ assignment }: Props) {
  const result = assignment.result;
  if (!result) return null;

  let globalQuestionNumber = 0;

  return (
    <div
      id="question-paper"
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 font-serif"
    >
      <div className="text-center mb-4 border-b-2 border-gray-800 pb-4">
        <h1 className="text-xl font-bold text-[#1C1917] uppercase tracking-wide">
          {result.schoolName}
        </h1>
        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <span>Subject: {result.subject}</span>
          <span>Class: {result.className}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700 mt-1">
          <span>Time Allowed: {result.timeAllowed}</span>
          <span>Maximum Marks: {result.maxMarks}</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 italic mb-4">
        All questions are compulsory unless stated otherwise.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div>
          Name:{" "}
          <span className="border-b border-gray-400 inline-block w-32">
            &nbsp;
          </span>
        </div>
        <div>
          Roll Number:{" "}
          <span className="border-b border-gray-400 inline-block w-20">
            &nbsp;
          </span>
        </div>
        <div>
          Class:{" "}
          <span className="border-b border-gray-400 inline-block w-20">
            &nbsp;
          </span>
        </div>
      </div>

      {result.sections.map((section, si) => (
        <div key={si} className="mb-6 break-inside-avoid-page">
          <div className="text-center mb-3">
            <h2 className="text-base font-bold text-[#1C1917] underline">
              {section.title}
            </h2>
          </div>
          <p className="text-xs text-gray-500 italic mb-3">
            {section.instruction}
          </p>

          <div className="space-y-3">
            {section.questions.map((q, qi) => {
              globalQuestionNumber++;
              const qNum = globalQuestionNumber;
              return (
                <div key={qi} className="flex items-start gap-3 break-inside-avoid mb-4">
                  <span className="text-sm font-semibold text-[#1C1917] min-w-[24px]">
                    {qNum}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-[#1C1917] leading-relaxed">
                          {q.text}
                        </p>
                        {q.options && q.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {q.options.map((opt: string, oi: number) => (
                              <p
                                key={oi}
                                className="text-sm text-gray-600 ml-2"
                              >
                                {opt}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize leading-none ${
                            difficultyStyle[q.difficulty] ||
                            difficultyStyle.medium
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap leading-none">
                          [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-8 border-t-2 border-gray-800 pt-4">
        <h3 className="text-base font-bold text-[#1C1917] mb-3">Answer Key:</h3>
        <div className="space-y-2">
          {result.answerKey.map((ak, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="font-semibold text-[#1C1917] min-w-[28px]">
                {ak.questionNumber}.
              </span>
              <span className="text-gray-700">{ak.answer}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">End of Question Paper</p>
      </div>
    </div>
  );
}
