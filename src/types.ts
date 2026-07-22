export interface MCQItem {
  id?: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  letterAnswer: "A" | "B" | "C" | "D";
  subject: string;
  slo: string;
  sloDescription: string;
  chapter: string;
  explanation: string;
}

export interface ChapterMeta {
  id: number;
  code: string;
  title: string;
  description: string;
  examName: string;
  questionCount: number;
  csvFileName: string;
  hasData: boolean;
  subjects: string[];
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  answers: Record<number, "A" | "B" | "C" | "D">;
  sloBreakdown: Record<string, { correct: number; total: number; title: string }>;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
}
