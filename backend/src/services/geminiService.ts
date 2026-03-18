import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAssignment } from '../models/Assignment';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateQuestionPaper = async (assignment: IAssignment) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  });

  const totalMarks = assignment.questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marks,
    0
  );
  const totalQuestions = assignment.questionTypes.reduce(
    (sum, qt) => sum + qt.count,
    0
  );

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
  "timeAllowed": "2 Hours",
  "maxMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries 2 marks.",
      "questions": [
        {
          "text": "Full question text here?",
          "difficulty": "easy",
          "marks": 2,
          "type": "Short Questions"
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionNumber": 1,
      "answer": "Detailed answer here."
    }
  ]
}

Rules:
- One section per question type (Section A, B, C, ...)
- difficulty must be exactly: "easy", "medium", or "hard"
- 40% easy, 40% medium, 20% hard distribution
- Generate exactly the requested number of questions per type
- answerKey must have one entry per question with sequential numbering
- Questions must be subject-appropriate and educationally accurate
- Return ONLY JSON`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
};