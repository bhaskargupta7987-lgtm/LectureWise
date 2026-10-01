import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper function with exponential backoff and fallback models for high-demand spikes (503/429)
async function callGeminiWithFallback(params: {
  contents: any;
  config?: any;
  preferredModel?: string;
  fallbackModels?: string[];
}) {
  const models = [
    params.preferredModel || 'gemini-3.8-flash',
    ...(params.fallbackModels || ['gemini-3.1-flash-lite', 'gemini-flash-latest']),
  ];

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Gemini API] Querying model: ${model} (attempt ${attempt + 1})`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          return { response, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err || '');
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('overloaded') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('429');

        console.warn(`[Gemini Warning] Model ${model} failed (attempt ${attempt + 1}): ${errMsg}`);

        if (isTransient && attempt === 0) {
          // Wait 1.5s backoff before retry
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        break; // try next model
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // POST /api/summarize
  app.post('/api/summarize', async (req, res) => {
    try {
      const {
        transcript,
        title = '',
        subject = 'General Academic',
        mode = 'comprehensive',
        customFocus = '',
      } = req.body;

      if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
        return res.status(400).json({ error: 'Lecture transcript is required.' });
      }

      const promptInstructions = `
You are an elite academic professor and expert pedagogical summarizer.
Your mission is to transform the provided raw lecture transcript into an impeccably structured, high-yield study suite.

Lecture Context:
- User-provided Title: ${title || 'Infer from transcript'}
- Academic Subject/Domain: ${subject}
- Summarization Depth Mode: ${mode} (Options: 'comprehensive' = detailed academic; 'exam-cram' = high-yield bulleted cheat sheet; 'eli5' = simplified analogies and plain english; 'executive' = crisp decision-maker summary).
${customFocus ? `- Specific Student Focus / Instructions: ${customFocus}` : ''}

Raw Transcript:
"""
${transcript.slice(0, 75000)}
"""

Extract and produce a comprehensive JSON structure following this exact schema:
{
  "title": string (engaging, precise academic lecture title),
  "subject": string (academic field),
  "estimatedLectureDurationMinutes": number (approximate based on word count ~130 wpm),
  "executiveSummary": string (2 to 3 substantive paragraphs summarizing core lecture narrative, context, and overarching themes),
  "coreThesis": string (one clear, powerful sentence capturing the central thesis or lesson),
  "keyTakeaways": [string] (4-6 definitive high-impact takeaways every student must know),
  "sections": [
    {
      "timestamp": string (estimated timestamp like "00:00" or chapter marker),
      "heading": string (descriptive chapter title),
      "summary": string (clear multi-sentence explanation of this section),
      "bullets": [string] (3-5 granular factual points, derivations, or arguments),
      "lecturerNoteOrAnalogy": string (specific real-world analogy, classroom anecdote, or memorable quote from the lecturer)
    }
  ],
  "keyConcepts": [
    {
      "term": string (the terminology, theorem, law, or mechanism),
      "definition": string (rigorous academic definition),
      "simpleExplanation": string (plain English ELI5 explanation that sticks in memory),
      "significance": string (why it matters in the discipline),
      "category": string (e.g. Core Principle, Mechanism, Empirical Case, Formula, Theorem),
      "formulaOrExample": string (formula, equation, code syntax, or concrete case study if relevant)
    }
  ],
  "revisionPoints": [
    {
      "topic": string (sub-area or theme),
      "highYieldFacts": [string] (facts that frequently show up in exams),
      "commonPitfallsOrMisconceptions": [string] (common student errors, confusing distinctions, or exam traps),
      "potentialExamQuestions": [string] (sample short-answer or essay questions likely to be asked)
    }
  ],
  "flashcards": [
    {
      "id": string (unique e.g. "fc-1"),
      "front": string (stimulating question or prompt testing active recall),
      "back": string (concise, precise answer with context),
      "hint": string (helpful memory cue without giving away the full answer),
      "tag": string (topic category)
    }
  ],
  "quizQuestions": [
    {
      "id": string (unique e.g. "q-1"),
      "question": string (challenging multiple-choice question testing understanding rather than rote recall),
      "options": [string] (4 plausible options A, B, C, D),
      "correctOptionIndex": number (0, 1, 2, or 3),
      "explanation": string (thorough rationale explaining why the correct choice is right and why the distractors are wrong),
      "conceptTested": string (which core concept this evaluates)
    }
  ],
  "mindmap": [
    {
      "id": string (unique e.g. "node-root", "node-1", "node-1-1"),
      "label": string (short label 2-5 words),
      "parentId": string (id of parent node, omit or empty for root node),
      "description": string (one sentence context),
      "color": string (hex color or theme tag like "indigo", "emerald", "amber", "rose", "cyan", "purple")
    }
  ]
}

Provide at least:
- 3 to 6 logical Sections
- 5 to 10 Key Concepts
- 3 to 5 Revision Point Topics
- 8 to 12 Flashcards
- 4 to 6 Quiz Questions
- 8 to 15 Mindmap nodes (structured logically from root lecture title -> main topics -> subtopics)
`;

      const { response, modelUsed } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
        contents: promptInstructions,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      console.log(`[Summarize Success] Processed using model: ${modelUsed}`);
      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, modelUsed });
      } catch (parseErr) {
        // Attempt cleaning markdown fences if any
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, modelUsed });
      }
    } catch (error: any) {
      console.error('Error generating lecture summary:', error);
      const isOverloaded =
        String(error?.message || '').includes('503') ||
        String(error?.message || '').includes('UNAVAILABLE') ||
        String(error?.message || '').includes('high demand') ||
        String(error?.status || '') === 'UNAVAILABLE';

      const userFriendlyMessage = isOverloaded
        ? 'The AI model is momentarily experiencing high global demand. Spikes are temporary—please click "Retry" in a few seconds.'
        : error.message || 'Failed to process lecture transcript.';

      res.status(isOverloaded ? 503 : 500).json({
        error: userFriendlyMessage,
        isTransient: isOverloaded,
      });
    }
  });

  // POST /api/ask (Grounded Q&A on the lecture)
  app.post('/api/ask', async (req, res) => {
    try {
      const { transcript, question, lectureTitle = 'Lecture' } = req.body;

      if (!question || !transcript) {
        return res.status(400).json({ error: 'Question and transcript are required.' });
      }

      const prompt = `
You are the AI Teaching Assistant for the lecture: "${lectureTitle}".
Answer the student's question strictly grounded in the content of the lecture transcript provided below.

Guidelines:
1. Explain clearly with academic accuracy and pedagogical clarity.
2. Quote or reference specific parts/analogies used by the lecturer when helpful.
3. If the lecture does not mention or answer the question, state politely that the topic wasn't covered in this specific lecture, but provide brief foundational context.
4. Format response in clean, readable Markdown (bullet points, bold key terms).

Student Question:
"${question}"

Lecture Transcript:
"""
${transcript.slice(0, 60000)}
"""
`;

      const { response } = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
        contents: prompt,
      });

      return res.json({ success: true, answer: response.text });
    } catch (error: any) {
      console.error('Error in lecture Q&A:', error);
      res.status(500).json({
        error:
          'AI service is momentarily busy. Please try asking again in a few moments.',
      });
    }
  });

  // POST /api/transcribe (Audio file transcription)
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/mp3' } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'Base64 audio data is required.' });
      }

      const audioPart = {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            {
              text: 'Transcribe this lecture recording accurately into coherent paragraphs. Preserve technical terms, lecturer explanations, and speaker distinctions if detectable.',
            },
          ],
        },
      });

      return res.json({ success: true, transcript: response.text });
    } catch (error: any) {
      console.error('Error in audio transcription:', error);
      res.status(500).json({ error: error.message || 'Failed to transcribe audio file.' });
    }
  });

  // Serve static files or Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lecture Summarizer Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
