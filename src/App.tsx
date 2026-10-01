import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Key,
  Flame,
  Layers,
  HelpCircle,
  Network,
  MessageSquare,
  Sparkles,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  PlusCircle,
  FileText,
  FileDown,
  RotateCcw
} from 'lucide-react';
import { LectureData, SummarizeMode } from './types/lecture';
import { DEFAULT_PRECOMPUTED_LECTURE } from './data/defaultLecture';
import { generateLecturePDF } from './utils/pdfGenerator';
import {
  getSavedLectures,
  saveLectureToStorage,
  deleteLectureFromStorage,
  toggleStarLecture,
  getActiveLectureId,
  setActiveLectureId,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { LectureInputModal } from './components/LectureInputModal';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { KeyConceptsView } from './components/KeyConceptsView';
import { RevisionSheetView } from './components/RevisionSheetView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { MindMapView } from './components/MindMapView';
import { AskLectureView } from './components/AskLectureView';
import { ExportModal } from './components/ExportModal';
import { SavedLecturesModal } from './components/SavedLecturesModal';

type ActiveTab = 'summary' | 'concepts' | 'revision' | 'flashcards' | 'quiz' | 'mindmap' | 'ask';

export default function App() {
  const [currentLecture, setCurrentLecture] = useState<LectureData>(() => {
    const saved = getSavedLectures();
    const activeId = getActiveLectureId();
    if (activeId) {
      const found = saved.find((l) => l.id === activeId);
      if (found) return found;
    }
    return saved.length > 0 ? saved[0] : DEFAULT_PRECOMPUTED_LECTURE;
  });

  const [savedLectures, setSavedLectures] = useState<LectureData[]>(() => {
    const saved = getSavedLectures();
    if (saved.length === 0) {
      saveLectureToStorage(DEFAULT_PRECOMPUTED_LECTURE);
      return [DEFAULT_PRECOMPUTED_LECTURE];
    }
    return saved;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [isNewLectureModalOpen, setIsNewLectureModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<{
    transcript: string;
    title: string;
    subject: string;
    mode: SummarizeMode;
    customFocus: string;
  } | null>(null);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('lecturewise_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lecturewise_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lecturewise_dark_mode', 'false');
    }
  }, [darkMode]);

  // Handle lecture submission
  const handleSummarizeLecture = async (payload: {
    transcript: string;
    title: string;
    subject: string;
    mode: SummarizeMode;
    customFocus: string;
  }) => {
    setIsLoading(true);
    setErrorToast(null);
    setLastSubmittedPayload(payload);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to process transcript with Gemini.');
      }

      const generated = json.data;
      const wordCount = payload.transcript.trim().split(/\s+/).length;

      const newLecture: LectureData = {
        id: `lecture-${Date.now()}`,
        title: generated.title || payload.title || 'Untitled Lecture',
        subject: generated.subject || payload.subject || 'Academic Lecture',
        createdAt: new Date().toISOString(),
        originalTranscript: payload.transcript,
        wordCount: wordCount,
        durationMinutesEstimated:
          generated.estimatedLectureDurationMinutes || Math.ceil(wordCount / 130),
        mode: payload.mode,
        coreThesis: generated.coreThesis || 'Key core thesis not provided.',
        executiveSummary: generated.executiveSummary || 'No summary generated.',
        keyTakeaways: generated.keyTakeaways || [],
        sections: generated.sections || [],
        keyConcepts: generated.keyConcepts || [],
        revisionPoints: generated.revisionPoints || [],
        flashcards: generated.flashcards || [],
        quizQuestions: generated.quizQuestions || [],
        mindmap: generated.mindmap || [],
        starred: false,
      };

      saveLectureToStorage(newLecture);
      setCurrentLecture(newLecture);
      setSavedLectures(getSavedLectures());
      setActiveLectureId(newLecture.id);
      setIsNewLectureModalOpen(false);
      setActiveTab('summary');
    } catch (err: any) {
      console.error(err);
      setErrorToast(err.message || 'An error occurred while summarizing the lecture.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLecture = (lecture: LectureData) => {
    setCurrentLecture(lecture);
    setActiveLectureId(lecture.id);
    setActiveTab('summary');
  };

  const handleDeleteLecture = (id: string) => {
    const updated = deleteLectureFromStorage(id);
    setSavedLectures(updated);
    if (currentLecture.id === id) {
      if (updated.length > 0) {
        setCurrentLecture(updated[0]);
        setActiveLectureId(updated[0].id);
      } else {
        saveLectureToStorage(DEFAULT_PRECOMPUTED_LECTURE);
        setCurrentLecture(DEFAULT_PRECOMPUTED_LECTURE);
        setSavedLectures([DEFAULT_PRECOMPUTED_LECTURE]);
        setActiveLectureId(DEFAULT_PRECOMPUTED_LECTURE.id);
      }
    }
  };

  const handleToggleStar = (id: string) => {
    const updated = toggleStarLecture(id);
    setSavedLectures(updated);
    if (currentLecture.id === id) {
      const refreshed = updated.find((l) => l.id === id);
      if (refreshed) setCurrentLecture(refreshed);
    }
  };

  const tabs = [
    {
      id: 'summary' as ActiveTab,
      label: 'Summary & Chapters',
      icon: BookOpen,
      count: currentLecture.sections?.length || 0,
    },
    {
      id: 'concepts' as ActiveTab,
      label: 'Key Concepts',
      icon: Key,
      count: currentLecture.keyConcepts?.length || 0,
    },
    {
      id: 'revision' as ActiveTab,
      label: 'Exam Revision Sheet',
      icon: Flame,
      count: currentLecture.revisionPoints?.length || 0,
      highlight: true,
    },
    {
      id: 'flashcards' as ActiveTab,
      label: 'Active Flashcards',
      icon: Layers,
      count: currentLecture.flashcards?.length || 0,
    },
    {
      id: 'quiz' as ActiveTab,
      label: 'Practice Quiz',
      icon: HelpCircle,
      count: currentLecture.quizQuestions?.length || 0,
    },
    {
      id: 'mindmap' as ActiveTab,
      label: 'Concept Mind Map',
      icon: Network,
      count: currentLecture.mindmap?.length || 0,
    },
    {
      id: 'ask' as ActiveTab,
      label: 'Ask Lecture (AI)',
      icon: MessageSquare,
      badge: 'Grounded',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Navbar */}
      <Navbar
        currentLecture={currentLecture}
        savedLectures={savedLectures}
        onSelectLecture={handleSelectLecture}
        onOpenNewLectureModal={() => setIsNewLectureModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Lecture Hero Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          {/* Subtle decorative gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentLecture.subject}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~{currentLecture.durationMinutesEstimated} mins lecture duration
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentLecture.wordCount.toLocaleString()} words
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Mode: {currentLecture.mode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {currentLecture.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {currentLecture.coreThesis}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => generateLecturePDF(currentLecture)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-2xs"
                title="Download formatted lecture notes as PDF"
              >
                <FileDown className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Export / Share</span>
              </button>
              <button
                onClick={() => setIsNewLectureModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-600/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                <span>New Summary</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Navigation Bar */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Toast / Banner if any */}
        {errorToast && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="space-y-0.5">
                <span className="font-bold block">Notice:</span>
                <span>{errorToast}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {lastSubmittedPayload && (
                <button
                  onClick={() => handleSummarizeLecture(lastSubmittedPayload)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry Now</span>
                </button>
              )}
              <button
                onClick={() => setErrorToast(null)}
                className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Panels */}
        <div className="transition-all duration-200">
          {activeTab === 'summary' && (
            <ExecutiveSummaryView lecture={currentLecture} />
          )}

          {activeTab === 'concepts' && (
            <KeyConceptsView
              concepts={currentLecture.keyConcepts}
              lectureTitle={currentLecture.title}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionSheetView
              revisionPoints={currentLecture.revisionPoints}
              lecture={currentLecture}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              cards={currentLecture.flashcards}
              lectureId={currentLecture.id}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              questions={currentLecture.quizQuestions}
              lectureTitle={currentLecture.title}
            />
          )}

          {activeTab === 'mindmap' && (
            <MindMapView
              nodes={currentLecture.mindmap}
              lecture={currentLecture}
            />
          )}

          {activeTab === 'ask' && (
            <AskLectureView lecture={currentLecture} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            <span>LectureWise AI • Transforming Raw Lectures into Mastery</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Powered by Gemini 3.8 Flash • High-Yield Synthesis & Revision Suite
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LectureInputModal
        isOpen={isNewLectureModalOpen}
        onClose={() => setIsNewLectureModalOpen(false)}
        onSubmit={handleSummarizeLecture}
        isLoading={isLoading}
      />

      <SavedLecturesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedLectures={savedLectures}
        currentLectureId={currentLecture.id}
        onSelectLecture={handleSelectLecture}
        onDeleteLecture={handleDeleteLecture}
        onToggleStar={handleToggleStar}
        onOpenNewLectureModal={() => setIsNewLectureModalOpen(true)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        lecture={currentLecture}
      />
    </div>
  );
}
