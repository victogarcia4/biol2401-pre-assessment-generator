import { MCQItem } from '../types';

/**
 * Fisher-Yates array shuffling algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffles options (A, B, C, D) for an individual MCQ while maintaining correct answer tracking.
 */
export function shuffleSingleMCQ(mcq: MCQItem): MCQItem {
  // Identify original correct answer string
  const originalCorrectText = (mcq[`option${mcq.letterAnswer}` as keyof MCQItem] as string) || mcq.correctAnswer;
  
  const options = [
    { text: mcq.optionA },
    { text: mcq.optionB },
    { text: mcq.optionC },
    { text: mcq.optionD },
  ];

  const shuffledOpts = shuffleArray(options);

  // Find index of original correct text in shuffled options
  const correctIdx = shuffledOpts.findIndex(o => o.text === originalCorrectText);
  const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  const newLetterAnswer = letters[correctIdx >= 0 ? correctIdx : 0];

  return {
    ...mcq,
    optionA: shuffledOpts[0].text,
    optionB: shuffledOpts[1].text,
    optionC: shuffledOpts[2].text,
    optionD: shuffledOpts[3].text,
    letterAnswer: newLetterAnswer,
    correctAnswer: originalCorrectText,
  };
}

/**
 * Shuffles both the sequence of questions AND the options within each question.
 */
export function shuffleExamQuestions(mcqs: MCQItem[]): MCQItem[] {
  if (!mcqs || mcqs.length === 0) return [];
  const shuffledMCQs = mcqs.map(shuffleSingleMCQ);
  return shuffleArray(shuffledMCQs);
}
