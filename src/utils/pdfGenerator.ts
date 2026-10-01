import { jsPDF } from 'jspdf';
import { LectureData } from '../types/lecture';

export function generateLecturePDF(lecture: LectureData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 130);
    doc.text(
      `LectureWise • ${lecture.title.length > 50 ? lecture.title.substring(0, 48) + '...' : lecture.title}`,
      margin,
      10
    );
    doc.setDrawColor(220, 224, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // --- Title & Metadata ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(24, 32, 54);
  const titleLines = doc.splitTextToSize(lecture.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8 + 2;

  // Metadata pills / subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 90, 110);
  const metaText = `Subject: ${lecture.subject}  |  Duration: ~${lecture.durationMinutesEstimated} mins  |  Words: ${lecture.wordCount.toLocaleString()}  |  Mode: ${lecture.mode.toUpperCase()}`;
  doc.text(metaText, margin, y);
  y += 6;

  // Divider line
  doc.setDrawColor(99, 102, 241); // indigo
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 40, y);
  y += 8;

  // --- Core Thesis Box ---
  checkPageBreak(25);
  doc.setFillColor(243, 244, 255); // soft indigo tint
  doc.setDrawColor(199, 210, 254);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);

  const thesisPrefix = 'Core Lecture Thesis: "';
  const thesisLines = doc.splitTextToSize(`${thesisPrefix}${lecture.coreThesis}"`, contentWidth - 8);
  const boxHeight = thesisLines.length * 5.5 + 8;
  doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');
  doc.text(thesisLines, margin + 4, y + 6);
  y += boxHeight + 8;

  // --- Executive Summary ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Executive Summary', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(lecture.executiveSummary, contentWidth);
  summaryLines.forEach((line: string) => {
    checkPageBreak(5);
    doc.text(line, margin, y);
    y += 4.8;
  });
  y += 6;

  // --- Key Takeaways ---
  if (lecture.keyTakeaways && lecture.keyTakeaways.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('2. Core Pedagogical Takeaways', margin, y);
    y += 6;

    lecture.keyTakeaways.forEach((takeaway, idx) => {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(79, 70, 229); // indigo
      doc.text(`[${idx + 1}]`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(takeaway, contentWidth - 10);
      doc.text(lines, margin + 8, y);
      y += lines.length * 5 + 2;
    });
    y += 6;
  }

  // --- Chapter Breakdown ---
  if (lecture.sections && lecture.sections.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('3. Lecture Chapters & Structured Breakdown', margin, y);
    y += 6;

    lecture.sections.forEach((sec, idx) => {
      checkPageBreak(22);

      // Chapter header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      const timeStr = sec.timestamp ? ` (${sec.timestamp})` : '';
      doc.text(`${idx + 1}. ${sec.heading}${timeStr}`, margin, y);
      y += 5;

      // Summary
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const secSummaryLines = doc.splitTextToSize(sec.summary, contentWidth);
      secSummaryLines.forEach((l: string) => {
        checkPageBreak(5);
        doc.text(l, margin, y);
        y += 4.5;
      });

      // Bullets
      if (sec.bullets && sec.bullets.length > 0) {
        sec.bullets.forEach((bullet) => {
          checkPageBreak(6);
          doc.setTextColor(79, 70, 229);
          doc.text('•', margin + 3, y);
          doc.setTextColor(51, 65, 85);
          const bLines = doc.splitTextToSize(bullet, contentWidth - 8);
          doc.text(bLines, margin + 8, y);
          y += bLines.length * 4.5 + 1;
        });
      }

      // Analogy note if present
      if (sec.lecturerNoteOrAnalogy) {
        checkPageBreak(14);
        doc.setFillColor(254, 243, 199); // amber soft
        doc.setDrawColor(251, 191, 36);
        const analogyLines = doc.splitTextToSize(
          `Analogy / Lecturer's Note: "${sec.lecturerNoteOrAnalogy}"`,
          contentWidth - 8
        );
        const aBoxHeight = analogyLines.length * 4.5 + 5;
        doc.roundedRect(margin + 4, y, contentWidth - 4, aBoxHeight, 1.5, 1.5, 'FD');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(120, 53, 15);
        doc.text(analogyLines, margin + 8, y + 4.5);
        y += aBoxHeight + 4;
      }
      y += 4;
    });
    y += 4;
  }

  // --- Key Concepts Dictionary ---
  if (lecture.keyConcepts && lecture.keyConcepts.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('4. Key Concepts & Glossary Terms', margin, y);
    y += 6;

    lecture.keyConcepts.forEach((kc) => {
      checkPageBreak(25);

      // Term + category
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(79, 70, 229);
      doc.text(kc.term, margin, y);

      if (kc.category) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`[${kc.category}]`, margin + doc.getTextWidth(kc.term) + 3, y);
      }
      y += 5;

      // Academic Definition
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Definition: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const defLines = doc.splitTextToSize(kc.definition, contentWidth - 22);
      doc.text(defLines, margin + 20, y);
      y += defLines.length * 4.5 + 1;

      // Plain English
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(5, 150, 105); // emerald
      doc.text('ELI5 (Plain English): ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(6, 78, 59);
      const eli5Lines = doc.splitTextToSize(kc.simpleExplanation, contentWidth - 36);
      doc.text(eli5Lines, margin + 34, y);
      y += eli5Lines.length * 4.5 + 1;

      // Why it matters
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Why It Matters: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const sigLines = doc.splitTextToSize(kc.significance, contentWidth - 26);
      doc.text(sigLines, margin + 25, y);
      y += sigLines.length * 4.5 + 1;

      // Formula / Example
      if (kc.formulaOrExample) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(109, 40, 217); // purple
        doc.text('Example/Formula: ', margin, y);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(91, 33, 182);
        const formLines = doc.splitTextToSize(kc.formulaOrExample, contentWidth - 32);
        doc.text(formLines, margin + 30, y);
        y += formLines.length * 4.5 + 1;
      }
      y += 4;
    });
    y += 4;
  }

  // --- High-Yield Exam Revision Points ---
  if (lecture.revisionPoints && lecture.revisionPoints.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('5. High-Yield Exam Revision Cheat-Sheet', margin, y);
    y += 6;

    lecture.revisionPoints.forEach((rp, idx) => {
      checkPageBreak(25);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Topic ${idx + 1}: ${rp.topic}`, margin, y);
      y += 5;

      // Facts
      rp.highYieldFacts.forEach((fact) => {
        checkPageBreak(6);
        doc.setTextColor(16, 185, 129); // green check/bullet
        doc.setFont('helvetica', 'bold');
        doc.text('✓', margin + 3, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const fLines = doc.splitTextToSize(fact, contentWidth - 8);
        doc.text(fLines, margin + 8, y);
        y += fLines.length * 4.5 + 1;
      });

      // Pitfalls / Traps
      if (rp.commonPitfallsOrMisconceptions && rp.commonPitfallsOrMisconceptions.length > 0) {
        rp.commonPitfallsOrMisconceptions.forEach((pitfall) => {
          checkPageBreak(6);
          doc.setTextColor(225, 29, 72); // rose warning
          doc.setFont('helvetica', 'bold');
          doc.text('!', margin + 3, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(159, 18, 57);
          const pLines = doc.splitTextToSize(`Exam Trap: ${pitfall}`, contentWidth - 8);
          doc.text(pLines, margin + 8, y);
          y += pLines.length * 4.5 + 1;
        });
      }

      // Potential Exam Questions
      if (rp.potentialExamQuestions && rp.potentialExamQuestions.length > 0) {
        rp.potentialExamQuestions.forEach((q) => {
          checkPageBreak(6);
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.text('?', margin + 3, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 41, 59);
          const qLines = doc.splitTextToSize(`Sample Prompt: ${q}`, contentWidth - 8);
          doc.text(qLines, margin + 8, y);
          y += qLines.length * 4.5 + 1;
        });
      }
      y += 4;
    });
    y += 4;
  }

  // --- Practice Exam Quiz ---
  if (lecture.quizQuestions && lecture.quizQuestions.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('6. Self-Assessment Practice Exam & Answer Key', margin, y);
    y += 6;

    lecture.quizQuestions.forEach((q, idx) => {
      checkPageBreak(25);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`Q${idx + 1}. ${q.question}`, contentWidth);
      doc.text(qLines, margin, y);
      y += qLines.length * 4.5 + 2;

      // Options
      q.options.forEach((opt, oIdx) => {
        checkPageBreak(5);
        const letter = String.fromCharCode(65 + oIdx);
        const isCorrect = oIdx === q.correctOptionIndex;

        doc.setFont('helvetica', isCorrect ? 'bold' : 'normal');
        doc.setTextColor(isCorrect ? 5 : 71, isCorrect ? 150 : 85, isCorrect ? 105 : 105);
        const optText = `  ${letter}) ${opt} ${isCorrect ? ' [Correct]' : ''}`;
        const optLines = doc.splitTextToSize(optText, contentWidth - 5);
        doc.text(optLines, margin + 4, y);
        y += optLines.length * 4.2;
      });

      // Explanation
      checkPageBreak(8);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const expLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 5);
      doc.text(expLines, margin + 4, y + 1);
      y += expLines.length * 4.2 + 4;
    });
  }

  // --- Add Page Numbers to All Pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${totalPages}  •  Generated by LectureWise AI`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Save PDF
  const safeFilename = lecture.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  doc.save(`${safeFilename || 'lecture-notes'}.pdf`);
}
