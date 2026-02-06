export type BlockType = 'theory' | 'question';
export type QuestionType = 'multiple-choice' | 'numeric' | 'roots-set' | 'coefficients' | 'matching' | 'quadratic-equation' | 'key-value' | 'coordinate-plot';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title?: string;
}

export interface TheoryBlockData extends BaseBlock {
  type: 'theory';
  content: string; // Supports LaTeX in $...$
  illustration?: string; // HTML/SVG string for diagrams
  diagramConfig?: {
    type: 'coordinate-system';
    points?: { x: number; y: number; label?: string; color?: string; showGuides?: boolean }[];
    lines?: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; style?: 'solid' | 'dashed'; label?: string; labelOffset?: { x: number; y: number } }[];
  };
  layout?: 'default' | 'side-by-side';
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
  targetCoordinate?: { x: number; y: number }; // For coordinate-plot type (single point)
  targetCoordinates?: { x: number; y: number }[]; // For coordinate-plot type (multiple points)
  targetLine?: { m: number; b: number }; // For coordinate-plot type (line)
  diagramConfig?: {
    type: 'coordinate-system';
    points?: { x: number; y: number; label?: string; color?: string; showGuides?: boolean }[];
    lines?: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; style?: 'solid' | 'dashed'; label?: string; labelOffset?: { x: number; y: number } }[];
  };
  maxPoints?: number;
  drawMode?: 'point' | 'line';
  onRegenerate?: boolean;
  layout?: 'default' | 'coordinate';
}

export type CurriculumItem = TheoryBlockData | QuestionBlockData;