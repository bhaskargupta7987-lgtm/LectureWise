export type SummarizeMode = 'comprehensive' | 'exam-cram' | 'eli5' | 'executive';

export interface SectionBreakdown {
  timestamp?: string;
  heading: string;
  summary: string;
  bullets: string[];
  lecturerNoteOrAnalogy?: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
  simpleExplanation: string;
  significance: string;
  category: string;
  formulaOrExample?: string;
}

export interface RevisionPoint {
  topic: string;
  highYieldFacts: string[];
  commonPitfallsOrMisconceptions: string[];
  potentialExamQuestions: string[];
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tag: string;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  conceptTested: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  parentId?: string;
  description?: string;
  color?: string;
}

export interface LectureData {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
  originalTranscript: string;
  wordCount: number;
  durationMinutesEstimated: number;
  mode: SummarizeMode;
  executiveSummary: string;
  coreThesis: string;
  keyTakeaways: string[];
  sections: SectionBreakdown[];
  keyConcepts: KeyConcept[];
  revisionPoints: RevisionPoint[];
  flashcards: FlashcardItem[];
  quizQuestions: QuizItem[];
  mindmap: MindMapNode[];
  starred?: boolean;
}

export interface FlashcardProgress {
  [cardId: string]: 'mastered' | 'learning' | 'unseen';
}

export interface QuizProgress {
  selectedOptions: { [questionId: string]: number };
  submitted: boolean;
  score: number;
}
