export type BlockType = 'theory' | 'question';
export type QuestionType = 'multiple-choice' | 'numeric' | 'roots-set' | 'coefficients' | 'matching' | 'quadratic-equation' | 'key-value';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title?: string;
}

export interface TheoryBlockData extends BaseBlock {
  type: 'theory';
  content: string; // Supports LaTeX in $...$
}

export interface QuestionBlockData extends BaseBlock {
  type: 'question';
  question: string; // Supports LaTeX
  illustration?: string; // HTML/SVG string for diagrams
  inputType: QuestionType;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[] | string[][]; // For numeric/text string, for roots-set array of strings, for coefficients multiple valid arrays
  matchPairs?: { left: string; right: string }[]; // For matching type
  hint: string;
  successMessage?: string;
  inputPrefix?: string; // LaTeX label before input, e.g. "$x \ge$"
  inputLabels?: string[]; // Labels for multiple inputs (key-value type)
}

export type CurriculumItem = TheoryBlockData | QuestionBlockData;