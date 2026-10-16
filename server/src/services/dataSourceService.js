import { DataSource } from '../models/DataSource.js';
import { env } from '../config/env.js';
import { youtubeTrendsProvider } from '../integrations/youtubeTrendsProvider.js';
import { instagramTrendsProvider } from '../integrations/instagramTrendsProvider.js';
import { tiktokTrendsProvider } from '../integrations/tiktokTrendsProvider.js';
import { googleTrendsProvider } from '../integrations/googleTrendsProvider.js';
import { metaAdsLibraryProvider } from '../integrations/metaAdsLibraryProvider.js';
import { webResearchProvider } from '../integrations/webResearchProvider.js';
import { geminiProvider } from '../integrations/geminiProvider.js';

const PROVIDER_MAP = {
  'youtube-trends': youtubeTrendsProvider,
  'instagram-trends': instagramTrendsProvider,
  'tiktok-creative-center': tiktokTrendsProvider,
  'google-trends': googleTrendsProvider,
  'meta-ads-library': metaAdsLibraryProvider,
  'web-research': webResearchProvider,
  'gemini-ai': geminiProvider,
};

const DEFAULT_SOURCES_META = [
  {
    providerId: 'gemini-ai',
    displayName: 'Google Gemini AI Engine',
    category: 'Generative AI & LLM',
    documentationUrl: 'https://aistudio.google.com/app/apikey',
    configSummary: { environmentVarName: 'GEMINI_API_KEY' },
  },
  {
    providerId: 'youtube-trends',
    displayName: 'YouTube Data API v3',
    category: 'Video & Shorts',
    documentationUrl: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
    configSummary: { environmentVarName: 'YOUTUBE_API_KEY' },
  },
  {
    providerId: 'instagram-trends',
    displayName: 'Instagram Graph API & Reels',
    category: 'Social & Reels',
    documentationUrl: 'https://developers.facebook.com/docs/instagram-api',
    configSummary: { environmentVarName: 'META_ACCESS_TOKEN' },
  },
  {
    providerId: 'tiktok-creative-center',
    displayName: 'TikTok Creative Center',
    category: 'Short-Form Viral',
    documentationUrl: 'https://ads.tiktok.com/business/creativecenter',
    configSummary: { environmentVarName: 'TIKTOK_PARTNER_KEY' },
  },
  {
    providerId: 'google-trends',
    displayName: 'Google Trends Engine',
    category: 'Search Demand',
    documentationUrl: 'https://trends.google.com/trends/explore',
    configSummary: { environmentVarName: 'GOOGLE_TRENDS_API_TOKEN' },
  },
  {
    providerId: 'meta-ads-library',
    displayName: 'Meta Ads Library',
    category: 'Paid Advertising',
    documentationUrl: 'https://www.facebook.com/ads/library',
    configSummary: { environmentVarName: 'META_APP_ID' },
  },
  {
    providerId: 'web-research',
    displayName: 'Tavily & Google News Web Research',
    category: 'Web & News',
    documentationUrl: 'https://tavily.com',
    configSummary: { environmentVarName: 'TAVILY_API_KEY' },
  },
];

export const dataSourceService = {
  /**
   * Retrieves all registered data sources with live status and DB sync metadata
   */
  async getAllSources() {
    const results = [];

    for (const meta of DEFAULT_SOURCES_META) {
      const provider = PROVIDER_MAP[meta.providerId];
      if (!provider) continue;

      let dbRecord = await DataSource.findOne({ providerId: meta.providerId });
      const liveStatus = await provider.getStatus();

      if (!dbRecord) {
        dbRecord = await DataSource.create({
          providerId: meta.providerId,
          displayName: meta.displayName,
          category: meta.category,
          status: liveStatus.status,
          requiresAuth: liveStatus.requiresAuth ?? false,
          availableFeatures: liveStatus.capabilities || [],
          limitations: liveStatus.limitations || [],
          documentationUrl: meta.documentationUrl,
          configSummary: {
            isConfigured: liveStatus.isConfigured ?? false,
            environmentVarName: meta.configSummary?.environmentVarName || '',
            maskedKey: this.getMaskedKey(meta.configSummary?.environmentVarName),
          },
        });
      } else {
        // Update live status if DB status is not manually disconnected
        if (dbRecord.status !== 'Disconnected') {
          dbRecord.status = liveStatus.status;
          dbRecord.availableFeatures = liveStatus.capabilities || dbRecord.availableFeatures;
          dbRecord.limitations = liveStatus.limitations || dbRecord.limitations;
          dbRecord.configSummary.isConfigured = liveStatus.isConfigured ?? false;
          dbRecord.configSummary.maskedKey = this.getMaskedKey(meta.configSummary?.environmentVarName);
          await dbRecord.save();
        }
      }

      results.push({
        ...dbRecord.toObject(),
        setupGuide: liveStatus.setupGuide || '',
      });
    }

    return results;
  },

  /**
   * Performs an actual authentication or data request test
   */
  async testSource(providerId, customConfig = null) {
    const provider = PROVIDER_MAP[providerId];
    if (!provider) {
      throw new Error(`Data source provider '${providerId}' not recognized`);
    }

    let dbRecord = await DataSource.findOne({ providerId });
    if (!dbRecord) {
      await this.getAllSources();
      dbRecord = await DataSource.findOne({ providerId });
    }

    const testResult = await provider.testConnection(customConfig?.key || customConfig?.token);

    dbRecord.lastAttemptAt = new Date();
    if (testResult.ok) {
      dbRecord.status = testResult.status || 'Connected';
      dbRecord.lastSyncAt = new Date();
      dbRecord.lastSuccessLatencyMs = testResult.latencyMs || 0;
      dbRecord.lastError = null;
    } else {
      dbRecord.status = testResult.status || 'Error';
      dbRecord.lastError = testResult.message;
    }

    await dbRecord.save();

    return {
      providerId,
      displayName: dbRecord.displayName,
      testResult,
      source: dbRecord,
    };
  },

  /**
   * Triggers an on-demand sync for a single provider
   */
  async syncSource(providerId) {
    const provider = PROVIDER_MAP[providerId];
    if (!provider) {
      throw new Error(`Provider '${providerId}' not found`);
    }

    const dbRecord = await DataSource.findOne({ providerId });
    let result;

    if (typeof provider.research === 'function') {
      result = await provider.research({ industry: 'Finance and Business', region: 'India' });
    } else if (typeof provider.testConnection === 'function') {
      const test = await provider.testConnection();
      result = {
        count: test.ok ? 1 : 0,
        status: test.ok ? 'Connected' : 'Authentication Required',
        message: test.message,
        latencyMs: test.latencyMs,
      };
    } else {
      result = { count: 1, status: 'Connected' };
    }

    if (dbRecord) {
      dbRecord.lastSyncAt = new Date();
      dbRecord.lastAttemptAt = new Date();
      dbRecord.recordCount = result.count || 0;
      if (result.status === 'Connected') {
        dbRecord.status = 'Connected';
        dbRecord.lastError = null;
      }
      await dbRecord.save();
    }

    return {
      providerId,
      result,
      source: dbRecord,
    };
  },

  /**
   * Safely updates credentials in process.env and updates DataSource document
   */
  async saveConfig(providerId, { apiKey, token }) {
    const dbRecord = await DataSource.findOne({ providerId });
    if (!dbRecord) throw new Error(`Provider '${providerId}' not found`);

    const val = (apiKey || token || '').trim();
    const envVar = dbRecord.configSummary?.environmentVarName;

    if (val) {
      if (envVar) {
        process.env[envVar] = val;
      }
      if (providerId === 'gemini-ai') {
        process.env.GEMINI_API_KEY = val;
        process.env.AI_API_KEY = val;
        env.AI_API_KEY = val;
        env.IS_DEMO_MODE = false;
      }
      dbRecord.credentials = { apiKey: val, token: val };
      dbRecord.configSummary.isConfigured = true;
      dbRecord.configSummary.maskedKey = val.length >= 8 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : '••••••••';
      dbRecord.configSummary.updatedAt = new Date();
      await dbRecord.save();
    }

    // Automatically run connection test
    return this.testSource(providerId, { key: val });
  },

  /**
   * Disconnects a data source
   */
  async disconnectSource(providerId) {
    const dbRecord = await DataSource.findOne({ providerId });
    if (!dbRecord) throw new Error(`Provider '${providerId}' not found`);

    const envVar = dbRecord.configSummary?.environmentVarName;
    if (envVar && process.env[envVar]) {
      delete process.env[envVar];
    }
    if (providerId === 'gemini-ai') {
      delete process.env.GEMINI_API_KEY;
      delete process.env.AI_API_KEY;
      env.AI_API_KEY = '';
      env.IS_DEMO_MODE = true;
    }

    dbRecord.status = 'Disconnected';
    dbRecord.credentials = { apiKey: '', token: '' };
    dbRecord.configSummary.isConfigured = false;
    dbRecord.configSummary.maskedKey = '';
    await dbRecord.save();

    return dbRecord;
  },

  getMaskedKey(envVarName) {
    if (!envVarName) return '';
    const val = process.env[envVarName];
    if (!val || val.length < 8) return '';
    return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`;
  },
};
