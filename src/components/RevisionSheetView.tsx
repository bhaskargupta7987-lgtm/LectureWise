import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  HelpCircle,
  Printer,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Sparkles,
  Copy,
  Check,
  FileDown,
  Loader2
} from 'lucide-react';
import { RevisionPoint, LectureData } from '../types/lecture';
import { generateLecturePDF } from '../utils/pdfGenerator';

interface RevisionSheetViewProps {
  revisionPoints: RevisionPoint[];
  lecture: LectureData;
}

export const RevisionSheetView: React.FC<RevisionSheetViewProps> = ({
  revisionPoints,
  lecture,
}) => {
  const [completedFacts, setCompletedFacts] = useState<{ [key: string]: boolean }>({});
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: string]: boolean }>({});
  const [copiedCheatSheet, setCopiedCheatSheet] = useState(false);

  const toggleFact = (key: string) => {
    setCompletedFacts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleQuestion = (key: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCheatSheet = async () => {
    const lines: string[] = [];
    lines.push(`EXAM CHEAT SHEET: ${lecture.title}`);
    lines.push(`Core Thesis: ${lecture.coreThesis}\n`);

    revisionPoints.forEach((rp) => {
      lines.push(`### ${rp.topic}`);
      lines.push('High-Yield Facts:');
      rp.highYieldFacts.forEach((f) => lines.push(`• ${f}`));
      if (rp.commonPitfallsOrMisconceptions?.length > 0) {
        lines.push('Exam Traps & Pitfalls:');
        rp.commonPitfallsOrMisconceptions.forEach((p) => lines.push(`⚠️ ${p}`));
      }
      if (rp.potentialExamQuestions?.length > 0) {
        lines.push('Potential Exam Questions:');
        rp.potentialExamQuestions.forEach((q) => lines.push(`❓ ${q}`));
      }
      lines.push('');
    });

    await navigator.clipboard.writeText(lines.join('\n'));
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  // Calculate total facts and mastered facts
  let totalFacts = 0;
  let masteredCount = 0;
  revisionPoints.forEach((rp, rpIdx) => {
    rp.highYieldFacts.forEach((_, fIdx) => {
      totalFacts++;
      if (completedFacts[`${rpIdx}-${fIdx}`]) masteredCount++;
    });
  });

  const progressPercent = totalFacts > 0 ? Math.round((masteredCount / totalFacts) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Revision Header Banner & Mastery Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-indigo-500/10 dark:from-amber-950/40 dark:via-rose-950/20 dark:to-indigo-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
              <Flame className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              High-Yield Exam Revision Cheat-Sheet
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Targeted exam facts, common student traps, and predicted examination prompts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Download PDF Notes Button */}
          <button
            onClick={() => generateLecturePDF(lecture)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            title="Download Formatted PDF"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Print Sheet Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyCheatSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/20 transition-all"
          >
            {copiedCheatSheet ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Counter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <FileCheck className="h-5 w-5 text-indigo-500" />
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Exam Fact Checklist
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Click checkboxes as you review to track your readiness
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-9">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-6">
        {revisionPoints.map((point, pIdx) => (
          <div
            key={pIdx}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm space-y-5"
          >
            {/* Topic Title */}
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Exam Topic {pIdx + 1}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {point.topic}
              </h4>
            </div>

            {/* High-Yield Facts */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  High-Yield Revision Points (Must-Know)
                </h5>
              </div>
              <div className="space-y-2">
                {point.highYieldFacts.map((fact, fIdx) => {
                  const key = `${pIdx}-${fIdx}`;
                  const isChecked = !!completedFacts[key];
                  return (
                    <button
                      key={fIdx}
                      type="button"
                      onClick={() => toggleFact(key)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900'
                          : 'border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isChecked
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-300 font-medium'
                        }`}
                      >
                        {fact}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Common Pitfalls & Traps */}
            {point.commonPitfallsOrMisconceptions && point.commonPitfallsOrMisconceptions.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    Common Pitfalls & Exam Traps (Avoid Losing Marks)
                  </span>
                </div>
                <div className="space-y-2 pl-2">
                  {point.commonPitfallsOrMisconceptions.map((pitfall, pitIdx) => (
                    <div key={pitIdx} className="flex items-start gap-2.5 text-xs text-rose-950 dark:text-rose-200 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span>{pitfall}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Potential Exam Questions */}
            {point.potentialExamQuestions && point.potentialExamQuestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <HelpCircle className="h-4 w-4 text-indigo-500" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Predicted Examination Prompts
                  </h5>
                </div>
                <div className="space-y-2">
                  {point.potentialExamQuestions.map((q, qIdx) => {
                    const qKey = `${pIdx}-q-${qIdx}`;
                    const isExpanded = !!expandedQuestions[qKey];
                    return (
                      <div
                        key={qIdx}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(qKey)}
                          className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                            ❓ {q}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">
                              Model Answer Strategy / Key Marking Rubric:
                            </span>
                            <p className="leading-relaxed">
                              Structure your answer around defining the core terminology, detailing the exact causal mechanism taught in this lecture, and providing the lecturer's counter-example or trade-off analysis.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
