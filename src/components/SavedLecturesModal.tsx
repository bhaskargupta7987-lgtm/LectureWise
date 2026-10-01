import React from 'react';
import {
  X,
  BookOpen,
  Trash2,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import { LectureData } from '../types/lecture';

interface SavedLecturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLectures: LectureData[];
  currentLectureId: string | null;
  onSelectLecture: (lecture: LectureData) => void;
  onDeleteLecture: (id: string) => void;
  onToggleStar: (id: string) => void;
  onOpenNewLectureModal: () => void;
}

export const SavedLecturesModal: React.FC<SavedLecturesModalProps> = ({
  isOpen,
  onClose,
  savedLectures,
  currentLectureId,
  onSelectLecture,
  onDeleteLecture,
  onToggleStar,
  onOpenNewLectureModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Saved Lecture Notebooks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between summarized courses and revision decks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
          {savedLectures.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                No Saved Lectures Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Paste a transcript or select a sample lecture to build your first revision notebook.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewLectureModal();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Summarize First Lecture</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedLectures.map((lec) => {
                const isActive = lec.id === currentLectureId;

                return (
                  <div
                    key={lec.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectLecture(lec);
                        onClose();
                      }}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {lec.subject}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Active
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {lec.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lec.durationMinutesEstimated} mins
                        </span>
                        <span>•</span>
                        <span>{lec.flashcards?.length || 0} Flashcards</span>
                        <span>•</span>
                        <span>{lec.quizQuestions?.length || 0} Quiz Qs</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onToggleStar(lec.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title={lec.starred ? 'Starred' : 'Star lecture'}
                      >
                        <Star
                          className={`h-4 w-4 ${lec.starred ? 'fill-amber-400 text-amber-500' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => onDeleteLecture(lec.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Delete lecture"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectLecture(lec);
                          onClose();
                        }}
                        className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                        title="Open notebook"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {savedLectures.length} Total Saved Notebooks
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenNewLectureModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Lecture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
