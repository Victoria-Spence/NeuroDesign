import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Honor the hosting platform's port, while keeping the local dev default.
function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parsePort(process.argv[portArgIndex + 1]);
  }
  const portEqualsArg = process.argv.find((arg) => arg.startsWith('--port='));
  if (portEqualsArg) {
    return parsePort(portEqualsArg.split('=')[1]);
  }
  return process.env.PORT
    ? parsePort(process.env.PORT)
    : process.env.NODE_ENV === 'production'
      ? 8080
      : 3000;
}

function parsePort(value: string): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid server port: ${value}`);
  }
  return port;
}

const app = express();
const port = getPort();

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS ?? 'https://victoria-spence.github.io,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use((req: Request, res: Response, next) => {
  const origin = req.get('Origin');
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Keep JSON uploads below Cloud Run's HTTP request size limit.
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper to format raw Gemini API errors into human-readable interior designer explanations
function formatGeminiError(error: any): string {
  if (!error) return 'An unknown error occurred while calling the AI model.';

  const rawMessage = error?.message || error?.toString() || '';

  // Check if error message contains embedded JSON (e.g. ApiError: {"error":{...}})
  const jsonMatch = rawMessage.match(/\{[\s\S]*"error"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error?.message) {
        let msg = parsed.error.message;
        if (parsed.error.code === 503) {
          msg = `Gemini Free-Tier Service Busy: ${msg} Please retry in a few moments.`;
        } else if (parsed.error.code === 429 || parsed.error.status === 'RESOURCE_EXHAUSTED') {
          msg = `Free-Tier Quota Limit Reached: ${msg} Please wait a moment before sending another evaluation request.`;
        } else if (parsed.error.code === 403 || parsed.error.status === 'PERMISSION_DENIED') {
          msg = `API key permission denied: ${msg} Please verify the GEMINI_API_KEY secret configured for the server.`;
        }
        return msg;
      }
    } catch {
      // ignore JSON parse error and fallback
    }
  }

  if (rawMessage.includes('503') || rawMessage.includes('UNAVAILABLE') || rawMessage.includes('high demand')) {
    return 'The Gemini model is temporarily experiencing high demand. Please try clicking Evaluate again in 10-15 seconds.';
  }

  if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return 'Free-tier request quota limit reached. Please wait a minute and retry.';
  }

  if (rawMessage.includes('403') || rawMessage.includes('PERMISSION_DENIED')) {
    return 'Permission denied. Please verify the GEMINI_API_KEY secret configured for the server.';
  }

  return rawMessage;
}

// Resilient caller with free-tier model fallback for transient spikes
async function generateWithFallback(params: {
  contents: any;
  systemInstruction?: string;
  responseSchema?: any;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Allowed free-tier models per guidelines
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
        },
      });

      if (response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} encountered issue:`, err?.message || err);
      lastError = err;

      // If high demand (503) or rate limit (429), try next candidate model
      const isTransient =
        err?.message?.includes('503') ||
        err?.message?.includes('UNAVAILABLE') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('429') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      if (!isTransient) {
        throw err; // Stop on configuration/auth or bad request errors
      }
    }
  }

  throw lastError;
}

// Endpoint: Health & status check
app.get('/api/health', (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey.length > 5),
    primaryModel: 'gemini-3.8-flash',
    fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
  });
});

// Endpoint 1: Extract criteria from user-supplied research text
app.post('/api/extract-criteria', async (req: Request, res: Response) => {
  try {
    const { researchText } = req.body;

    if (!researchText || typeof researchText !== 'string' || researchText.trim().length < 15) {
      return res.status(400).json({
        error: 'Please provide valid lighting research text with sources (minimum 15 characters).',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    const prompt = `You are an expert neuro-architectural lighting researcher.
Analyze the following lighting research text and citations supplied by the interior designer.
Extract specific, actionable design criteria that an interior designer can evaluate on an architectural lighting plan or luminaire specification.

USER-SUPPLIED RESEARCH:
"""
${researchText}
"""

RULES:
1. ONLY extract criteria that originate directly from the supplied text.
2. DO NOT invent authors, journals, or standards not present or referenced in the text.
3. For each criterion, state the specific source cited (e.g. Figueiro et al., WELL v2 L03, Boyce, IESNA, etc.) as mentioned in the text.
4. Categorize each criterion into one of: "Circadian & Chronobiology", "Visual Comfort & Glare", "Task & Focal Lighting", "Atmosphere & Biophilia", or "Technical Specification".
5. Provide a clear, actionable target description that specifies tangible attributes (e.g., CCT range, direct/indirect distribution, vertical illuminance, dimming scenes, shielding angle, placement relative to sightlines).
6. Return between 3 and 8 distinct, well-defined criteria.`;

    const result = await generateWithFallback({
      contents: prompt,
      systemInstruction: 'You extract structured design criteria strictly grounded in the user-supplied lighting research and citations. Never invent sources.',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          researchSummary: {
            type: Type.STRING,
            description: 'A concise 1-2 sentence synthesis of the supplied lighting research.',
          },
          extractedCriteria: {
            type: Type.ARRAY,
            description: 'List of actionable design criteria derived from the research.',
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: 'Unique slug ID like crit-1, crit-2' },
                title: { type: Type.STRING, description: 'Clear descriptive title of the criterion' },
                category: { type: Type.STRING, description: 'Category name' },
                researchSource: { type: Type.STRING, description: 'Exact source citation from the user text' },
                targetCriteria: { type: Type.STRING, description: 'Measurable or observable design requirement' },
              },
              required: ['id', 'title', 'category', 'researchSource', 'targetCriteria'],
            },
          },
        },
        required: ['researchSummary', 'extractedCriteria'],
      },
    });

    const parsedData = JSON.parse(result.text);
    return res.json({ ...parsedData, modelUsed: result.modelUsed });
  } catch (error: any) {
    console.error('Error extracting criteria:', error);
    const friendlyMessage = formatGeminiError(error);
    return res.status(500).json({ error: friendlyMessage, details: error?.message || String(error) });
  }
});

// Endpoint 2: Evaluate lighting design against approved criteria
app.post('/api/evaluate-design', async (req: Request, res: Response) => {
  try {
    const { criteria, notes, imageBase64, imageMimeType } = req.body;

    if (!Array.isArray(criteria) || criteria.length === 0) {
      return res.status(400).json({
        error: 'Please provide at least one approved design criterion for evaluation.',
      });
    }

    if (!notes && !imageBase64) {
      return res.status(400).json({
        error: 'Please provide either a lighting plan image or explanatory design notes.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    const criteriaFormatted = criteria
      .map(
        (c: any, i: number) =>
          `CRITERION [${i + 1}] (ID: ${c.id}):
- Title: ${c.title}
- Category: ${c.category}
- Research Source: ${c.researchSource}
- Target Criteria Requirement: ${c.targetCriteria}`
      )
      .join('\n\n');

    const promptText = `You are an expert architectural lighting designer and neuro-architecture scientist evaluating a lighting design.

EVALUATION TASK:
Compare the provided lighting design (visual plan/render and/or designer explanatory notes) against the approved research-based criteria below.

APPROVED RESEARCH CRITERIA:
"""
${criteriaFormatted}
"""

DESIGNER EXPLANATORY NOTES & SPECIFICATIONS:
"""
${notes || 'No accompanying notes provided. Evaluate solely from the uploaded lighting plan / drawing.'}
"""

CRITICAL EVALUATION CONSTRAINTS:
1. STATUS OPTIONS: For each criterion, you MUST assign exactly ONE of these four statuses:
   - "Addressed" (clear visual or documented evidence meets the research requirement)
   - "Partly addressed" (partially meets requirement or contains trade-offs/conflicts)
   - "Needs attention" (clear contradiction or critical omission that impairs comfort/circadian health)
   - "Insufficient information" (cannot be determined without further technical specifications)
2. DO NOT INVENT SOURCES: Reference ONLY the research sources provided in each criterion. Do not fabricate studies.
3. DO NOT ASSUME TECHNICAL PERFORMANCE FROM IMAGES: Visual inspection of a 2D CAD plan or render CANNOT verify photometric metrics like exact photopic lux, Melanopic Equivalent Daylight Illuminance (M-EDI), Unified Glare Rating (UGR), flicker frequency, or exact TM-30 Rf/Rg fidelity.
4. REQUEST MISSING SPECIFICATIONS: For criteria where technical performance is required but unverified, set status to "Partly addressed" or "Insufficient information" and explicitly list the missing specifications (e.g. beam distribution, CCT spectral data, dimming range, optical shielding angles, sensor zones).
5. PRACTICAL IMPROVEMENT: Provide a practical, concrete recommendation for an interior designer (e.g., repositioning fixtures, adding deep-recessed baffles, adjusting control schedules, warm-dimming drivers).
6. EVIDENCE: Cite specific elements from the drawing (fixture symbols, coves, pendants, daylight openings, switch zones) and notes.`;

    let contentParts: any;

    if (imageBase64) {
      // Strip data:image/*;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      const mime = imageMimeType || 'image/jpeg';

      contentParts = {
        parts: [
          {
            inlineData: {
              mimeType: mime,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      };
    } else {
      contentParts = promptText;
    }

    const result = await generateWithFallback({
      contents: contentParts,
      systemInstruction: `You are an architectural neuro-lighting evaluator for interior designers.
You evaluate designs rigorously against user-provided research criteria.
Never assume technical lighting performance (lux, UGR, melanopic lux) can be verified purely from an image.
Always request missing specifications when needed.
Statuses must be strictly: 'Addressed', 'Partly addressed', 'Needs attention', or 'Insufficient information'.`,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallAlignmentScore: {
            type: Type.INTEGER,
            description: 'Overall alignment percentage score from 0 to 100.',
          },
          executiveSummary: {
            type: Type.STRING,
            description: 'Executive design summary evaluating the design against the research body.',
          },
          keyStrengths: {
            type: Type.ARRAY,
            description: '2 to 4 confirmed design strengths.',
            items: { type: Type.STRING },
          },
          priorityAdjustments: {
            type: Type.ARRAY,
            description: '2 to 4 priority design adjustments needed.',
            items: { type: Type.STRING },
          },
          evaluations: {
            type: Type.ARRAY,
            description: 'Evaluation for each criterion.',
            items: {
              type: Type.OBJECT,
              properties: {
                criterionId: { type: Type.STRING },
                criterionTitle: { type: Type.STRING },
                status: {
                  type: Type.STRING,
                  description: 'Must be Addressed, Partly addressed, Needs attention, or Insufficient information',
                },
                designEvidence: {
                  type: Type.STRING,
                  description: 'Specific evidence observed in the plan or stated in notes',
                },
                researchGrounding: {
                  type: Type.STRING,
                  description: 'Direct reference to the supplied research and citation',
                },
                practicalImprovement: {
                  type: Type.STRING,
                  description: 'Practical interior design recommendation',
                },
                missingSpecifications: {
                  type: Type.STRING,
                  description: 'Missing technical specifications needed to verify performance',
                },
              },
              required: [
                'criterionId',
                'criterionTitle',
                'status',
                'designEvidence',
                'researchGrounding',
                'practicalImprovement',
                'missingSpecifications',
              ],
            },
          },
        },
        required: [
          'overallAlignmentScore',
          'executiveSummary',
          'keyStrengths',
          'priorityAdjustments',
          'evaluations',
        ],
      },
    });

    const evaluationResult = JSON.parse(result.text);
    return res.json({ ...evaluationResult, modelUsed: result.modelUsed });
  } catch (error: any) {
    console.error('Error evaluating design:', error);
    const friendlyMessage = formatGeminiError(error);
    return res.status(500).json({ error: friendlyMessage, details: error?.message || String(error) });
  }
});

// Mount Vite in dev or serve static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(Number(port), '0.0.0.0', () => {
    console.log(`NeuroDesign server listening on port ${port} (0.0.0.0)`);
  });

  server.on('error', (err: any) => {
    console.error(`Server error on port ${port}:`, err);
  });
}

startServer();
