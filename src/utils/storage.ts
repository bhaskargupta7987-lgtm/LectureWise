import { LectureData, FlashcardProgress } from '../types/lecture';

const STORAGE_KEY_LECTURES = 'lecturewise_saved_lectures_v1';
const STORAGE_KEY_FLASHCARDS = 'lecturewise_flashcard_progress_v1';
const STORAGE_KEY_ACTIVE_LECTURE = 'lecturewise_active_id';

export function getSavedLectures(): LectureData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LECTURES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved lectures from localStorage', e);
    return [];
  }
}

export function saveLectureToStorage(lecture: LectureData): void {
  try {
    const existing = getSavedLectures();
    const index = existing.findIndex((l) => l.id === lecture.id);
    let updated: LectureData[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = lecture;
    } else {
      updated = [lecture, ...existing];
    }
    localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(updated));
    setActiveLectureId(lecture.id);
  } catch (e) {
    console.error('Failed to save lecture to localStorage', e);
  }
}

export function deleteLectureFromStorage(id: string): LectureData[] {
  try {
    const existing = getSavedLectures();
    const updated = existing.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete lecture', e);
    return [];
  }
}

export function toggleStarLecture(id: string): LectureData[] {
  try {
    const existing = getSavedLectures();
    const updated = existing.map((l) => (l.id === id ? { ...l, starred: !l.starred } : l));
    localStorage.setItem(STORAGE_KEY_LECTURES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to star lecture', e);
    return [];
  }
}

export function getActiveLectureId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_LECTURE);
  } catch {
    return null;
  }
}

export function setActiveLectureId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_LECTURE, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_LECTURE);
    }
  } catch {}
}

export function getFlashcardProgress(lectureId: string): FlashcardProgress {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_FLASHCARDS}_${lectureId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveFlashcardProgress(lectureId: string, progress: FlashcardProgress): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_FLASHCARDS}_${lectureId}`, JSON.stringify(progress));
  } catch {}
}

export function generateLectureMarkdown(lecture: LectureData): string {
  const lines: string[] = [];

  lines.push(`# ${lecture.title}`);
  lines.push(`**Subject:** ${lecture.subject} | **Date:** ${new Date(lecture.createdAt).toLocaleDateString()} | **Estimated Duration:** ~${lecture.durationMinutesEstimated} mins`);
  lines.push(`\n> **Core Thesis:** ${lecture.coreThesis}\n`);

  lines.push(`## 📌 Key Takeaways`);
  lecture.keyTakeaways.forEach((k) => lines.push(`- ${k}`));
  lines.push('');

  lines.push(`## 📖 Executive Summary`);
  lines.push(lecture.executiveSummary);
  lines.push('');

  lines.push(`## 🏛️ Lecture Structure & Chapter Breakdown`);
  lecture.sections.forEach((sec, idx) => {
    lines.push(`### ${idx + 1}. ${sec.heading} ${sec.timestamp ? `(${sec.timestamp})` : ''}`);
    lines.push(sec.summary);
    lines.push('');
    if (sec.bullets && sec.bullets.length > 0) {
      sec.bullets.forEach((b) => lines.push(`- ${b}`));
      lines.push('');
    }
    if (sec.lecturerNoteOrAnalogy) {
      lines.push(`> 💡 *Lecturer's Note / Analogy:* ${sec.lecturerNoteOrAnalogy}\n`);
    }
  });

  lines.push(`## 🔑 Key Concepts & Definitions`);
  lecture.keyConcepts.forEach((kc) => {
    lines.push(`### **${kc.term}** [${kc.category}]`);
    lines.push(`- **Definition:** ${kc.definition}`);
    lines.push(`- **Plain English (ELI5):** ${kc.simpleExplanation}`);
    lines.push(`- **Why It Matters:** ${kc.significance}`);
    if (kc.formulaOrExample) {
      lines.push(`- **Formula / Example:** \`${kc.formulaOrExample}\``);
    }
    lines.push('');
  });

  lines.push(`## 🎯 High-Yield Exam Revision Points`);
  lecture.revisionPoints.forEach((rp) => {
    lines.push(`### ${rp.topic}`);
    lines.push(`**High-Yield Facts:**`);
    rp.highYieldFacts.forEach((f) => lines.push(`- ${f}`));
    if (rp.commonPitfallsOrMisconceptions?.length > 0) {
      lines.push(`\n**⚠️ Common Traps & Pitfalls:**`);
      rp.commonPitfallsOrMisconceptions.forEach((p) => lines.push(`- ⚠️ ${p}`));
    }
    if (rp.potentialExamQuestions?.length > 0) {
      lines.push(`\n**Sample Exam Questions:**`);
      rp.potentialExamQuestions.forEach((q) => lines.push(`- ❓ ${q}`));
    }
    lines.push('');
  });

  if (lecture.quizQuestions?.length > 0) {
    lines.push(`## 📝 Self-Assessment Practice Quiz`);
    lecture.quizQuestions.forEach((q, idx) => {
      lines.push(`### Question ${idx + 1}: ${q.question}`);
      q.options.forEach((opt, oIdx) => {
        const isCorrect = oIdx === q.correctOptionIndex;
        lines.push(`  ${String.fromCharCode(65 + oIdx)}) ${opt} ${isCorrect ? '✅ [Correct]' : ''}`);
      });
      lines.push(`\n*Explanation:* ${q.explanation}\n`);
    });
  }

  lines.push(`\n---\n*Summarized with LectureWise AI*`);
  return lines.join('\n');
}

export function downloadTextFile(content: string, filename: string, mimeType = 'text/markdown'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
