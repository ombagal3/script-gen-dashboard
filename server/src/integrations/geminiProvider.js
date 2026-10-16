import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { DataSource } from '../models/DataSource.js';
import { getLanguagePromptInstruction, normalizeLanguage } from '../utils/languageHelper.js';

/**
 * Provider adapter for Google Gemini Generative AI Engine
 * Supports gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
 * Enables real-time script generation, shooting briefs, and trend synthesis.
 */
class GeminiProvider {
  constructor() {
    this.providerId = 'gemini-ai';
    this.displayName = 'Google Gemini AI Engine';
    this.category = 'Generative AI & LLM';
  }

  /**
   * Resolves the active API key: environment variable or saved DB credential
   */
  async getApiKey(overrideKey = null) {
    if (overrideKey && typeof overrideKey === 'string' && overrideKey.trim()) {
      return overrideKey.trim();
    }
    // Dynamic dotenv reload so saving server/.env updates process.env immediately without server restart
    try {
      dotenv.config({ override: true });
    } catch {
      // ignore
    }

    const key = process.env.GEMINI_API_KEY?.trim() 
      || process.env.AI_API_KEY?.trim() 
      || process.env.GOOGLE_API_KEY?.trim() 
      || env.AI_API_KEY?.trim();

    if (key) {
      return key;
    }

    // Check DataSource record in DB (e.g. configured via UI modal)
    try {
      const record = await DataSource.findOne({ providerId: this.providerId });
      if (record?.credentials?.apiKey) {
        return record.credentials.apiKey.trim();
      }
    } catch {
      // Fallback
    }
    return '';
  }

  /**
   * Returns an initialized GoogleGenAI instance if key is present
   */
  async getClient(overrideKey = null) {
    const key = await this.getApiKey(overrideKey);
    if (!key) return null;
    return new GoogleGenAI({ apiKey: key });
  }

  /**
   * Resolves the active model, safely upgrading legacy 1.5 versions to 3.5-flash-lite
   */
  getActiveModel() {
    const raw = (process.env.AI_MODEL || env.AI_MODEL || '').trim();
    if (!raw || raw.includes('1.5') || raw === 'gemini-2.5-flash' || raw === 'gemini-2.5-flash-lite') {
      return 'gemini-3.5-flash-lite';
    }
    return raw;
  }

  /**
   * Safe research probe used by data sources sync pipeline
   */
  async research({ industry = 'General', region = 'India' } = {}) {
    const test = await this.testConnection();
    return {
      providerId: this.providerId,
      status: test.ok ? 'Connected' : 'Authentication Required',
      count: test.ok ? 1 : 0,
      latencyMs: test.latencyMs,
      message: test.message,
      data: {
        engine: 'Google Gemini Generative AI',
        model: this.getActiveModel(),
        ready: test.ok,
      },
    };
  }

  /**
   * Returns current connection status and limitations
   */
  async getStatus() {
    const key = await this.getApiKey();
    const isConfigured = Boolean(key && key.length > 5);

    return {
      status: isConfigured ? 'Connected' : 'Not Configured',
      requiresAuth: true,
      isConfigured,
      capabilities: [
        'Live Multi-Hook Generation (Curiosity, Contrarian, Problem-Agitation)',
        'Full Ready-to-Shoot Video Script Synthesis in Hinglish/Hindi/English',
        'Visual Scene Direction & Framing Instructions',
        'Editing Cuts, Pacing & B-Roll Specification',
        'Audience Engagement & CTA Optimization',
      ],
      limitations: [
        'Subject to Google AI Studio rate limits and quotas (15 RPM for free tier).',
        'Requires valid Google AI Studio Gemini API Key.',
      ],
      setupGuide:
        'Get your free Gemini API key from Google AI Studio: https://aistudio.google.com/app/apikey. Add GEMINI_API_KEY in server/.env or click Configure below.',
    };
  }

  /**
   * Live ping test: verifies key validity with Google Gemini API
   */
  async testConnection(customKey = null) {
    const key = await this.getApiKey(customKey);

    if (!key) {
      return {
        ok: false,
        status: 'Not Configured',
        message: 'No Gemini API key provided. Set GEMINI_API_KEY in server/.env or enter in Configure modal.',
        latencyMs: 0,
      };
    }

    const modelName = this.getActiveModel();
    const startTime = Date.now();
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      // Lightweight test prompt to verify credentials and model connectivity
      const response = await ai.models.generateContent({
        model: modelName,
        contents: 'Ping test. Reply with: {"status": "ok"}',
        config: {
          maxOutputTokens: 25,
        },
      });

      const latencyMs = Date.now() - startTime;
      const text = response?.text?.trim() || '';

      return {
        ok: true,
        status: 'Connected',
        latencyMs,
        message: `Successfully connected to Google Gemini (${modelName}) in ${latencyMs}ms. Response: ${text.substring(0, 30)}`,
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      let msg = err.message || 'Gemini API connection error';
      if (msg.includes('API_KEY_INVALID') || msg.includes('400')) {
        msg = 'Invalid Gemini API Key. Please verify your key on https://aistudio.google.com/app/apikey';
      } else if (msg.includes('QUOTA_EXCEEDED') || msg.includes('429')) {
        msg = 'Gemini API quota exceeded or rate limited. Please try again shortly.';
      }

      return {
        ok: false,
        status: 'Authentication Required',
        latencyMs,
        message: msg,
      };
    }
  }

  /**
   * Generates structured script using Google Gemini
   */
  async generateScript({ module, category, objective, language, duration, inputData, method }) {
    const ai = await this.getClient();
    if (!ai) return null;

    const cleanLanguage = normalizeLanguage(language);
    const languageInstruction = getLanguagePromptInstruction(cleanLanguage);

    // Safe diagnostic log without leaking secrets or full prompts
    console.log(`[GeminiProvider] Generating script | Module: ${module} | Category: ${category} | Language: ${cleanLanguage} | Model: ${this.getActiveModel()}`);

    const prompt = `You are an elite short-form video scriptwriter and viral content strategist for Instagram Reels and YouTube Shorts.
Generate an original, ready-to-shoot video script.

MODULE: ${module}
CATEGORY: ${category}
OBJECTIVE: ${objective}
${languageInstruction}
TARGET DURATION: ${duration} seconds
FRAMEWORK / METHOD: ${method?.name || 'Hook → Problem → Value → CTA'}
INPUT DETAILS: ${JSON.stringify(inputData)}

Return strictly valid JSON with no markdown wrapping, matching this exact structure:
{
  "title": "Compelling Title",
  "hook": "Strongest single hook",
  "body": "Step-by-step spoken script with pauses and natural delivery cues",
  "cta": "Engaging CTA tailored to objective",
  "fullContent": "Complete compiled script",
  "sections": {
    "hookVariations": [
      "Hook 1 (Contrarian / Curious)",
      "Hook 2 (Urgent Problem / Pain point)",
      "Hook 3 (Unexpected Story / Secret)"
    ],
    "onScreenText": [
      "[0:00 - 0:03] Text overlay",
      "[0:03 - 0:15] Text overlay",
      "[0:15 - 0:40] Text overlay",
      "[0:40 - 0:55] Text overlay",
      "[0:55 - 1:00] Text overlay"
    ],
    "bRoll": [
      "Visual shot cue 1",
      "Visual shot cue 2",
      "Visual shot cue 3"
    ],
    "caption": "Instagram/YouTube caption with spacing",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "tone": "Direct, authentic, conversational",
    "platform": "Instagram Reels / YouTube Shorts"
  }
}`;

    const response = await ai.models.generateContent({
      model: this.getActiveModel(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text);
    return {
      title: parsed.title || inputData.title || `${category} Script`,
      module,
      category,
      objective,
      language: cleanLanguage,
      duration,
      hook: parsed.hook || '',
      body: parsed.body || '',
      cta: parsed.cta || '',
      fullContent: parsed.fullContent || `[HOOK]\n${parsed.hook}\n\n[BODY]\n${parsed.body}\n\n[CTA]\n${parsed.cta}`,
      sections: parsed.sections || {},
    };
  }

  /**
   * Generates full 5-part shooting brief package using Gemini
   */
  async generateShootingBrief({ topic, trendData, strategy }) {
    const ai = await this.getClient();
    if (!ai) return null;

    const cleanLanguage = normalizeLanguage(strategy?.preferredLanguage || 'English');
    const languageInstruction = getLanguagePromptInstruction(cleanLanguage);

    console.log(`[GeminiProvider] Generating shooting brief | Language: ${cleanLanguage} | Model: ${this.getActiveModel()}`);

    const prompt = `You are a professional video production director and viral script strategist.
Generate a complete, production-ready 5-part Shooting Brief Package.

TOPIC: ${topic}
INDUSTRY: ${strategy?.niche || 'Business & Creator'}
TARGET AUDIENCE: ${strategy?.targetAudience || 'General Audience'}
${languageInstruction}
TREND CONTEXT: ${JSON.stringify(trendData || {})}

Return strictly valid JSON with this exact structure:
{
  "title": "Video Title",
  "opportunityScore": 92,
  "angle": "Why this angle works now",
  "script": {
    "recommendedHook": "Best primary hook",
    "hookOptions": [
      {
        "type": "Contrarian Angle",
        "text": "Hook text...",
        "whyItWorks": "Psychological explanation",
        "estimatedRetentionLift": "+15-20%"
      },
      {
        "type": "Curiosity Gap",
        "text": "Hook text...",
        "whyItWorks": "Psychological explanation",
        "estimatedRetentionLift": "+12-18%"
      },
      {
        "type": "Problem Agitation",
        "text": "Hook text...",
        "whyItWorks": "Psychological explanation",
        "estimatedRetentionLift": "+18-25%"
      }
    ],
    "bodySections": [
      { "sectionName": "The Core Problem", "spokenText": "...", "durationSeconds": 15 },
      { "sectionName": "The Actionable Shift", "spokenText": "...", "durationSeconds": 25 },
      { "sectionName": "Real World Proof", "spokenText": "...", "durationSeconds": 15 }
    ],
    "cta": "Actionable closing CTA",
    "teleprompterText": "Clean, unformatted spoken script with pause markers for direct teleprompter reading"
  },
  "shootingInstructions": {
    "cameraAngle": "Direct eye-level / slightly lower with subtle 45-degree key light",
    "framing": "Head and shoulders, top third eye line, vertical 9:16",
    "lighting": "Soft key light at 45 degrees, subtle warm rim light",
    "wardrobe": "Solid neutral shirt, no busy patterns",
    "teleprompterNotes": "Speak with urgency in first 3 seconds, then relax into conversational cadence",
    "scenes": [
      { "sceneNumber": 1, "shotType": "Punch-in Close Up", "visualAction": "Direct eye contact, hand gesture", "durationSeconds": 3 },
      { "sceneNumber": 2, "shotType": "Medium Shot", "visualAction": "Explaining with two distinct hand positions", "durationSeconds": 15 },
      { "sceneNumber": 3, "shotType": "Close Up", "visualAction": "Leaning in slightly for emphasis", "durationSeconds": 25 },
      { "sceneNumber": 4, "shotType": "Medium Shot", "visualAction": "Delivering punchline / solution", "durationSeconds": 12 },
      { "sceneNumber": 5, "shotType": "Punch-in Close Up", "visualAction": "Points to comment / save icon", "durationSeconds": 5 }
    ]
  },
  "editingInstructions": {
    "cutsAndPacing": "Cut on every punctuation mark. Remove all breath gaps exceeding 0.15s. Target 140-155 WPM rhythm.",
    "captionStyle": "Bold single-line animated captions with yellow keyword highlights on bottom third.",
    "soundEffects": [
      { "timestamp": "0:01", "effectName": "Subtle Bass Drop / Whoosh on hook transition" },
      { "timestamp": "0:15", "effectName": "Crisp Paper Flip / Pop on step reveal" }
    ],
    "bRollCues": [
      { "timestamp": "0:04", "visualDescription": "Fast screen screen recording or paper breakdown", "source": "Stock or phone screen recording" }
    ]
  },
  "uploadPackage": {
    "suggestedPublishingTime": "Today between 7:30 PM - 8:30 PM IST (Peak vernacular attention window)",
    "caption": "Engaging caption with line breaks and call to action",
    "hashtags": ["#Topic", "#Industry", "#Reels", "#ViralShorts"],
    "pinnedComment": "Question to spark comments"
  }
}`;

    const response = await ai.models.generateContent({
      model: this.getActiveModel(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    return JSON.parse(response.text);
  }
}

export const geminiProvider = new GeminiProvider();
