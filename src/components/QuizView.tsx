import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizItem } from '../types/lecture';

interface QuizViewProps {
  questions: QuizItem[];
  lectureTitle: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, lectureTitle }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleGradeQuiz = () => {
    setSubmitted(true);
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    if (percent >= 75) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  // Score calculation
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctOptionIndex) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Banner & Score Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500 text-white shadow-xs">
              <HelpCircle className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Self-Assessment Practice Exam
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Concept-testing multiple choice questions derived from this lecture.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Final Score
              </div>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {correctCount} / {totalQuestions} ({scorePercent}%)
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {answeredCount} of {totalQuestions} Answered
            </span>
            <button
              onClick={handleGradeQuiz}
              disabled={answeredCount === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Award className="h-4 w-4" />
              <span>Submit & Grade Exam</span>
            </button>
          </div>
        )}
      </div>

      {/* Submitted Results Trophy Banner */}
      {submitted && (
        <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${
          scorePercent >= 75
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
        }`}>
          <div className={`p-3 rounded-2xl ${scorePercent >= 75 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-bold text-base">
              {scorePercent >= 75 ? 'Mastery Demonstrated!' : 'Good Effort! Keep Reviewing.'}
            </h4>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {scorePercent >= 75
                ? 'You scored in the top tier! You have synthesized the core definitions, trade-offs, and analogies from this lecture.'
                : 'Review the detailed explanations below to understand where concepts diverged from the lecture narrative.'}
            </p>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-800/80 shadow-sm transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-800/80'
                    : 'border-rose-300 dark:border-rose-800/80'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                    {q.conceptTested && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Concept Tested: {q.conceptTested}
                      </span>
                    )}
                  </div>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="h-4 w-4" />
                        Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = userChoice === optIdx;
                  const isThisCorrect = optIdx === q.correctOptionIndex;

                  let optionStyles = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/40';

                  if (isSelected && !submitted) {
                    optionStyles = 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-1 ring-indigo-600 text-indigo-900 dark:text-indigo-200';
                  }

                  if (submitted) {
                    if (isThisCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 font-medium';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyles = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 line-through opacity-80';
                    } else {
                      optionStyles = 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${optionStyles}`}
                    >
                      <span className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {letter}
                      </span>
                      <span className="leading-relaxed font-normal">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation */}
              {submitted && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Explanation & Pedagogical Rationale:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
