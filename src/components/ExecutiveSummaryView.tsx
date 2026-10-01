import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Clock,
  Sparkles,
  Quote,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { LectureData, SectionBreakdown } from '../types/lecture';

interface ExecutiveSummaryViewProps {
  lecture: LectureData;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({ lecture }) => {
  const [expandedSections, setExpandedSections] = useState<{ [index: number]: boolean }>({
    0: true,
    1: true,
  });
  const [copiedSectionIndex, setCopiedSectionIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  useEffect(() => {
    // Cleanup audio when switching lectures or unmounting
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lecture.id]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopySummary = async () => {
    const text = `Thesis: ${lecture.coreThesis}\n\nExecutive Summary:\n${lecture.executiveSummary}\n\nKey Takeaways:\n${lecture.keyTakeaways.map((t) => `• ${t}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopySection = async (sec: SectionBreakdown, index: number) => {
    const text = `${sec.heading} (${sec.timestamp || ''})\n${sec.summary}\n${sec.bullets.map((b) => `• ${b}`).join('\n')}${sec.lecturerNoteOrAnalogy ? `\nLecturer Note: ${sec.lecturerNoteOrAnalogy}` : ''}`;
    await navigator.clipboard.writeText(text);
    setCopiedSectionIndex(index);
    setTimeout(() => setCopiedSectionIndex(null), 2000);
  };

  // Text-to-Speech Player
  const togglePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${lecture.title}. Core Thesis: ${lecture.coreThesis}. Executive Summary: ${lecture.executiveSummary}. Key Takeaways: ${lecture.keyTakeaways.join('. ')}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      togglePlayAudio();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & TTS Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayAudio}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPlayingAudio
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/25 animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Read-Aloud</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                <span>Listen to Summary</span>
              </>
            )}
          </button>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {[1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-0.5 rounded ${
                  speechRate === rate
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {copiedSummary ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Core Thesis Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-purple-500/10 dark:from-indigo-950/40 dark:via-sky-950/20 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/80 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 shrink-0 mt-0.5">
            <Quote className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Central Lecture Thesis
            </div>
            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              "{lecture.coreThesis}"
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary Narrative */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Executive Summary & Narrative
          </h3>
        </div>
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line font-normal">
          {lecture.executiveSummary}
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Key Pedagogical Takeaways
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({lecture.keyTakeaways.length} Core Insights)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lecture.keyTakeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
            >
              <div className="h-6 w-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {takeaway}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lecture Chapters & Section Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Chapter & Section Breakdown
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({lecture.sections.length} Chapters)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const allOpen: { [k: number]: boolean } = {};
                lecture.sections.forEach((_, i) => (allOpen[i] = true));
                setExpandedSections(allOpen);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Expand All
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setExpandedSections({})}
              className="text-xs text-slate-500 dark:text-slate-400 hover:underline"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {lecture.sections.map((section, idx) => {
            const isExpanded = !!expandedSections[idx];
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden transition-all"
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {section.heading}
                      </h4>
                      {section.timestamp && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {section.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 dark:border-slate-700/60">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {section.summary}
                    </p>

                    {/* Factual Bullets */}
                    {section.bullets && section.bullets.length > 0 && (
                      <div className="space-y-1.5 pl-1">
                        {section.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Lecturer Note / Analogy Callout */}
                    {section.lecturerNoteOrAnalogy && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-0.5">
                            Lecturer's Analogy / Anecdote
                          </span>
                          <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 italic leading-relaxed">
                            "{section.lecturerNoteOrAnalogy}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Section Copy Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleCopySection(section, idx)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {copiedSectionIndex === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">Copied Chapter</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Chapter Notes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
