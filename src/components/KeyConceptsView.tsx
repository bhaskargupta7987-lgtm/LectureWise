import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Lightbulb,
  Tag,
  Star,
  Sparkles,
  Copy,
  Check,
  Code,
  Layers,
  HelpCircle
} from 'lucide-react';
import { KeyConcept } from '../types/lecture';

interface KeyConceptsViewProps {
  concepts: KeyConcept[];
  lectureTitle: string;
}

export const KeyConceptsView: React.FC<KeyConceptsViewProps> = ({ concepts, lectureTitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarkedTerms, setBookmarkedTerms] = useState<Set<string>>(new Set());
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    concepts.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [concepts]);

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return concepts.filter((c) => {
      const matchesSearch =
        c.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.significance.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [concepts, searchQuery, selectedCategory]);

  const toggleBookmark = (term: string) => {
    setBookmarkedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  };

  const handleCopyConcept = async (concept: KeyConcept) => {
    const text = `**${concept.term}** [${concept.category}]\nDefinition: ${concept.definition}\nPlain English: ${concept.simpleExplanation}\nWhy It Matters: ${concept.significance}${concept.formulaOrExample ? `\nExample/Formula: ${concept.formulaOrExample}` : ''}`;
    await navigator.clipboard.writeText(text);
    setCopiedTerm(concept.term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, mechanisms, theorems, or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span>
              Showing {filteredConcepts.length} of {concepts.length} concepts
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Concepts Grid */}
      {filteredConcepts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            No concepts match your search
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search query or switching category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConcepts.map((concept) => {
            const isBookmarked = bookmarkedTerms.has(concept.term);
            const isCopied = copiedTerm === concept.term;

            return (
              <div
                key={concept.term}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                        {concept.term}
                      </h4>
                      {concept.category && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                          {concept.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBookmark(concept.term)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark for revision'}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isBookmarked ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleCopyConcept(concept)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Copy Concept"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Academic Definition */}
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {concept.definition}
                    </p>
                  </div>

                  {/* Plain English (ELI5) Box */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 mb-3 flex items-start gap-2.5">
                    <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        In Plain English (ELI5)
                      </span>
                      <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                        {concept.simpleExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Why It Matters (Significance) */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                      Why It Matters for Exams & Field:
                    </span>
                    <p className="leading-relaxed">{concept.significance}</p>
                  </div>
                </div>

                {/* Formula / Example / Code if available */}
                {concept.formulaOrExample && (
                  <div className="mt-2 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      <Code className="h-3 w-3 text-indigo-500" />
                      <span>Formula / Example / Implementation</span>
                    </div>
                    <code className="block p-2 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-xs text-indigo-700 dark:text-indigo-300 overflow-x-auto">
                      {concept.formulaOrExample}
                    </code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
