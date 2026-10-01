import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  RefreshCw,
  Lightbulb,
  Keyboard,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FlashcardItem, FlashcardProgress } from '../types/lecture';
import { getFlashcardProgress, saveFlashcardProgress } from '../utils/storage';

interface FlashcardsViewProps {
  cards: FlashcardItem[];
  lectureId: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, lectureId }) => {
  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered'>('all');
  const [progress, setProgress] = useState<FlashcardProgress>(() => getFlashcardProgress(lectureId));

  // Sync deck when cards change
  useEffect(() => {
    setDeck(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [cards]);

  // Save progress
  const updateCardStatus = useCallback((cardId: string, status: 'mastered' | 'learning') => {
    setProgress((prev) => {
      const next = { ...prev, [cardId]: status };
      saveFlashcardProgress(lectureId, next);

      // Check if all are mastered
      const allMastered = cards.every((c) => (next[c.id] || 'unseen') === 'mastered');
      if (allMastered && status === 'mastered') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      return next;
    });
  }, [cards, lectureId]);

  // Filtered Deck
  const activeDeck = useMemo(() => {
    if (filter === 'mastered') {
      return deck.filter((c) => progress[c.id] === 'mastered');
    }
    if (filter === 'learning') {
      return deck.filter((c) => progress[c.id] === 'learning' || !progress[c.id] || progress[c.id] === 'unseen');
    }
    return deck;
  }, [deck, filter, progress]);

  // Keep index in bounds
  useEffect(() => {
    if (currentIndex >= activeDeck.length && activeDeck.length > 0) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
    setShowHint(false);
  }, [activeDeck.length, filter]);

  const currentCard = activeDeck[currentIndex];

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  }, [activeDeck.length]);

  const handlePrev = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  }, [activeDeck.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleResetProgress = () => {
    const empty: FlashcardProgress = {};
    setProgress(empty);
    saveFlashcardProgress(lectureId, empty);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1' && currentCard) {
        e.preventDefault();
        updateCardStatus(currentCard.id, 'learning');
        handleNext();
      } else if (e.key === '2' && currentCard) {
        e.preventDefault();
        updateCardStatus(currentCard.id, 'mastered');
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard, updateCardStatus]);

  // Statistics
  const masteredCount = cards.filter((c) => progress[c.id] === 'mastered').length;
  const learningCount = cards.filter((c) => progress[c.id] === 'learning').length;
  const masteryPercentage = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Deck Stats & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Cards ({cards.length})
          </button>
          <button
            onClick={() => setFilter('learning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'learning'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Review ({cards.length - masteredCount})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'mastered'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Mastered ({masteredCount})
          </button>
        </div>

        {/* Shuffle & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Shuffle deck"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors"
            title="Reset mastery status"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="px-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Deck Mastery: {masteryPercentage}%
          </span>
          <span>({masteredCount} of {cards.length} Mastered)</span>
        </div>
        {activeDeck.length > 0 && (
          <span className="font-mono font-medium">
            Card {currentIndex + 1} of {activeDeck.length}
          </span>
        )}
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${masteryPercentage}%` }}
        />
      </div>

      {/* Flashcard Area */}
      {activeDeck.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <Trophy className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">
            {filter === 'learning' ? 'Outstanding Job!' : 'No Cards Found'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {filter === 'learning'
              ? 'You have mastered all cards in this lecture! Switch to "All Cards" or reset to review again.'
              : 'Switch filters above to view other cards in this lecture.'}
          </p>
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            View All Cards
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            className="cursor-pointer select-none perspective-1000 min-h-[300px] sm:min-h-[340px] flex"
          >
            <div
              className={`w-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between border shadow-lg transition-all duration-300 relative overflow-hidden ${
                isFlipped
                  ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border-indigo-700 text-white shadow-indigo-900/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              {/* Card Header & Tag */}
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  isFlipped
                    ? 'bg-indigo-800/80 text-indigo-200'
                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {currentCard.tag || 'Concept'}
                </span>
                <div className="flex items-center gap-2">
                  {progress[currentCard.id] === 'mastered' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mastered
                    </span>
                  )}
                  <span className={`text-[11px] flex items-center gap-1 ${
                    isFlipped ? 'text-indigo-300' : 'text-slate-400'
                  }`}>
                    <RotateCw className="h-3 w-3" />
                    Click or Space to flip
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="my-auto py-6">
                {!isFlipped ? (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Prompt / Question:
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold leading-relaxed">
                      {currentCard.front}
                    </h3>
                  </div>
                ) : (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                      Answer & Explanation:
                    </span>
                    <p className="text-base sm:text-lg leading-relaxed font-medium text-slate-100">
                      {currentCard.back}
                    </p>
                  </div>
                )}

                {/* Hint Drawer */}
                {currentCard.hint && !isFlipped && (
                  <div className="mt-4">
                    {showHint ? (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{currentCard.hint}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        Need a hint?
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Flip Prompt */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  {isFlipped ? 'Answer View' : 'Question View'}
                </span>
                <span className="text-[11px]">
                  {progress[currentCard.id] === 'learning' ? 'In Review' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation & Grading Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                title="Previous card (Left Arrow)"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleFlip}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <RotateCw className="h-4 w-4 text-indigo-500" />
                <span>Flip Card</span>
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                title="Next card (Right Arrow)"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Self-Rating Buttons (1 & 2) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  updateCardStatus(currentCard.id, 'learning');
                  handleNext();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-xs font-bold text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Still Learning (1)</span>
              </button>

              <button
                onClick={() => {
                  updateCardStatus(currentCard.id, 'mastered');
                  handleNext();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mastered (2)</span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Keyboard className="h-3.5 w-3.5" />
              Keyboard Shortcuts:
            </span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">Space</kbd> Flip</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">← / →</kbd> Next/Prev</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">1</kbd> Learning</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">2</kbd> Mastered</span>
          </div>
        </div>
      )}
    </div>
  );
};
