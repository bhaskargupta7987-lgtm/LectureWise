import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Printer,
  FileCode,
  Share2,
  Sparkles,
  FileDown,
  Loader2
} from 'lucide-react';
import { LectureData } from '../types/lecture';
import { generateLectureMarkdown, downloadTextFile } from '../utils/storage';
import { generateLecturePDF } from '../utils/pdfGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, lecture }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const markdownContent = generateLectureMarkdown(lecture);

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      setTimeout(() => {
        generateLecturePDF(lecture);
        setIsGeneratingPdf(false);
      }, 100);
    } catch (e) {
      console.error('Failed to generate PDF', e);
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const safeTitle = lecture.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(markdownContent, `${safeTitle}-notes.md`, 'text/markdown');
  };

  const handleDownloadJSON = () => {
    const safeTitle = lecture.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(
      JSON.stringify(lecture, null, 2),
      `${safeTitle}-study-data.json`,
      'application/json'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Export & Download Notes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate formatted PDF notes, Markdown, or raw JSON
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
        <div className="p-6 space-y-6">
          {/* Primary Featured PDF Card */}
          <div className="p-5 rounded-2xl border-2 border-indigo-500 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/50 dark:from-indigo-950/60 dark:via-slate-800 dark:to-sky-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                  Recommended
                </span>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  Formatted Academic PDF
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Download Formatted PDF Notes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                Complete A4 printable notes with Executive Summary, Chapters, Key Concept glossary, Exam Traps, and Practice Quiz.
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Building PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  <span>Download .PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Export Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Download Markdown */}
            <button
              onClick={handleDownloadMarkdown}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
            >
              <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Markdown (.md)
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                For Obsidian & Notion.
              </p>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyMarkdown}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
            >
              <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {copied ? 'Copied!' : 'Copy Text'}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Copy full study guide.
              </p>
            </button>

            {/* Raw JSON Data */}
            <button
              onClick={handleDownloadJSON}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-left transition-all group"
            >
              <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <FileCode className="h-5 w-5" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                JSON Backup
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Full structured data.
              </p>
            </button>
          </div>

          {/* Markdown Preview Box */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Quick Text Preview:
              </span>
              <span>{markdownContent.length.toLocaleString()} characters</span>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto leading-relaxed select-all">
              {markdownContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
