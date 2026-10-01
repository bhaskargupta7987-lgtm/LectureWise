import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Upload,
  BookOpen,
  Mic,
  Cpu,
  Brain,
  TrendingUp,
  Atom,
  Clock,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flame,
  Lightbulb,
  Briefcase
} from 'lucide-react';
import { SAMPLE_LECTURES, SampleLecture } from '../data/sampleLectures';
import { SummarizeMode } from '../types/lecture';

interface LectureInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    transcript: string;
    title: string;
    subject: string;
    mode: SummarizeMode;
    customFocus: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const LectureInputModal: React.FC<LectureInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [mode, setMode] = useState<SummarizeMode>('comprehensive');
  const [customFocus, setCustomFocus] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [transcribingAudio, setTranscribingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const wordCount = transcript.trim().length > 0 ? transcript.trim().split(/\s+/).length : 0;
  const estimatedMins = Math.ceil(wordCount / 130);

  const handleSelectSample = (sample: SampleLecture) => {
    setSelectedSampleId(sample.id);
    setTranscript(sample.transcript);
    setTitle(sample.title);
    setSubject(sample.subject);
    setMode(sample.defaultMode);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError(null);

    // Text file (.txt, .md, .vtt, .srt, .json)
    if (file.name.match(/\.(txt|md|srt|vtt|json)$/i) || file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setTranscript(text);
          if (!title) {
            setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
          }
        }
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|m4a|webm|ogg)$/i)) {
      // Audio file transcription via Gemini
      setTranscribingAudio(true);
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Data = (event.target?.result as string).split(',')[1];
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Data,
              mimeType: file.type || 'audio/mp3',
            }),
          });
          const result = await response.json();
          if (result.success && result.transcript) {
            setTranscript(result.transcript);
            if (!title) {
              setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
            }
          } else {
            setAudioError(result.error || 'Failed to transcribe audio file.');
          }
          setTranscribingAudio(false);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setAudioError(err.message || 'Error uploading audio file.');
        setTranscribingAudio(false);
      }
    } else {
      setAudioError('Unsupported file type. Please upload a .txt, .srt, .vtt, or audio file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;

    await onSubmit({
      transcript,
      title: title.trim() || 'Untitled Lecture',
      subject: subject.trim() || 'Academic Study',
      mode,
      customFocus: customFocus.trim(),
    });
  };

  const getSubjectIcon = (sampleId: string) => {
    switch (sampleId) {
      case 'sample-cs-cap':
        return <Cpu className="h-4 w-4 text-indigo-500" />;
      case 'sample-neuro-ltp':
        return <Brain className="h-4 w-4 text-emerald-500" />;
      case 'sample-macro-inflation':
        return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case 'sample-astro-blackholes':
        return <Atom className="h-4 w-4 text-rose-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Summarize a New Lecture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste transcript, upload audio/notes, or load a sample lecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading || transcribingAudio}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preset Sample Lectures */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Quick Test: Load Pre-built Lecture
              </label>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                1-click instant fill
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SAMPLE_LECTURES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                    selectedSampleId === sample.id
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                    {getSubjectIcon(sample.id)}
                    <span className="truncate">{sample.subject}</span>
                  </div>
                  <p className="line-clamp-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                    {sample.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <span>{sample.duration}</span>
                    <span>~{sample.wordCount} words</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lecture Metadata Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Lecture Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems & Consistency Models"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Domain / Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science, Neurobiology, Law, Economics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Summarization Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Revision & Summarization Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'comprehensive' as SummarizeMode,
                  label: 'Comprehensive',
                  sub: 'Full chapters & deep theory',
                  icon: BookOpen,
                  badge: 'Standard',
                },
                {
                  id: 'exam-cram' as SummarizeMode,
                  label: 'Exam Cram',
                  sub: 'High-yield facts & traps',
                  icon: Flame,
                  badge: 'Popular',
                },
                {
                  id: 'eli5' as SummarizeMode,
                  label: 'ELI5 Analogies',
                  sub: 'Plain English & metaphors',
                  icon: Lightbulb,
                  badge: 'Intuitive',
                },
                {
                  id: 'executive' as SummarizeMode,
                  label: 'Executive',
                  sub: 'High-level takeaways',
                  icon: Briefcase,
                  badge: 'Concise',
                },
              ].map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 ring-1 ring-indigo-600 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`h-4 w-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        active
                          ? 'bg-indigo-200/60 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200'
                          : 'bg-slate-200/50 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>
                        {m.badge}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                      {m.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {m.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transcript Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-500" />
                Lecture Transcript
              </label>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                {wordCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    ~{estimatedMins} min read ({wordCount.toLocaleString()} words)
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload text/audio
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.srt,.vtt,.json,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={8}
                placeholder="Paste the raw lecture transcript here, or click one of the sample lectures above..."
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  setSelectedSampleId(null);
                }}
                className="w-full p-4 rounded-xl text-xs sm:text-sm font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"
              />
              {transcript.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setTranscript('');
                    setSelectedSampleId(null);
                  }}
                  className="absolute bottom-3 right-3 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Audio Transcribing Alert */}
            {transcribingAudio && (
              <div className="mt-2.5 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2 animate-pulse">
                <Mic className="h-4 w-4 animate-bounce" />
                <span>Transcribing audio file with Gemini 3.5 Transcribe... This may take a moment.</span>
              </div>
            )}

            {audioError && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{audioError}</span>
              </div>
            )}
          </div>

          {/* Custom Focus Instructions (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Student Focus (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., 'Emphasize mathematical formulas and common exam pitfalls', or 'Highlight medical receptor pathways'"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || transcribingAudio}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!transcript.trim() || isLoading || transcribingAudio}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Study Suite...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Full Lecture Suite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
