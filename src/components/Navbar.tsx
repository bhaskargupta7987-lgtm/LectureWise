import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FolderOpen,
  Share2,
  PlusCircle,
  Moon,
  Sun,
  FileText,
  Clock,
  Layers,
  Star
} from 'lucide-react';
import { LectureData } from '../types/lecture';

interface NavbarProps {
  currentLecture: LectureData | null;
  savedLectures: LectureData[];
  onSelectLecture: (lecture: LectureData) => void;
  onOpenNewLectureModal: () => void;
  onOpenSavedModal: () => void;
  onOpenExportModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLecture,
  savedLectures,
  onSelectLecture,
  onOpenNewLectureModal,
  onOpenSavedModal,
  onOpenExportModal,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors bg-white/90 border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                LectureWise
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                AI Revision
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Turn transcripts into high-yield summaries & study tools
            </p>
          </div>
        </div>

        {/* Center: Lecture Title & Selector */}
        {currentLecture && (
          <div className="hidden md:flex items-center gap-2 max-w-md">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="font-medium truncate max-w-[200px]" title={currentLecture.title}>
                {currentLecture.title}
              </span>
              <span className="text-slate-400 dark:text-slate-500">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
                {currentLecture.subject}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved Lectures Button */}
          <button
            onClick={onOpenSavedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Saved Lectures"
          >
            <FolderOpen className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">My Lectures</span>
            {savedLectures.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {savedLectures.length}
              </span>
            )}
          </button>

          {/* Export / Share Button */}
          {currentLecture && (
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Export Summary & Flashcards"
            >
              <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* New Lecture Button */}
          <button
            onClick={onOpenNewLectureModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Summarize Lecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
