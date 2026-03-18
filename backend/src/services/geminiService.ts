import axios from 'axios';
import { IAssignment } from '../models/Assignment';

export const generateQuestionPaper = async (assignment: IAssignment) => {
  const totalMarks = assignment.questionTypes.reduce((s, qt) => s + qt.count * qt.marks, 0);
  const totalQuestions = assignment.questionTypes.reduce((s, qt) => s + qt.count, 0);
  const qtText = assignment.questionTypes
    .map((qt) => `- ${qt.type}: ${qt.count} questions × ${qt.marks} marks each`)
    .join('\n');

  const prompt = `You are an expert teacher. Generate a complete question paper as valid JSON only.

Subject: ${assignment.subject}
Class: ${assignment.className}
Topic/Title: ${assignment.title}
Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}
${assignment.fileText ? `\nReference Content:\n${assignment.fileText.substring(0, 2000)}` : ''}
${assignment.additionalInfo ? `\nSpecial Instructions: ${assignment.additionalInfo}` : ''}

Question Types:
${qtText}

Return ONLY this JSON structure with no markdown, no backticks, no explanation:
{
  "schoolName": "Delhi Public School",
  "subject": "${assignment.subject}",
  "className": "${assignment.className}",
  "timeAllowed": "1 Hour",
  "maxMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions.",
      "questions": [
        {
          "text": "Question text here?",
          "difficulty": "easy",
          "marks": 2,
          "type": "Short Questions",
          "options": []
        }
      ]
    }
  ],
  "answerKey": [
    { "questionNumber": 1, "answer": "Answer here." }
  ]
}

Rules:
- One section per question type
- difficulty must be exactly: "easy", "medium", or "hard"
- For MCQ, populate options array with 4 choices like "A) option text"
- For non-MCQ, leave options as empty array
- Generate exactly the requested number of questions
- Return ONLY JSON`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
  );

  const text = response.data.candidates[0].content.parts[0].text.trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
};