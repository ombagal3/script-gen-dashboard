import { Trend } from '../models/Trend.js';
import { TrendResearch } from '../models/TrendResearch.js';
import { googleTrendsProvider } from '../integrations/googleTrendsProvider.js';
import { webResearchProvider } from '../integrations/webResearchProvider.js';
import { metaAdsLibraryProvider } from '../integrations/metaAdsLibraryProvider.js';
import { tiktokTrendsProvider } from '../integrations/tiktokTrendsProvider.js';
import { instagramTrendsProvider } from '../integrations/instagramTrendsProvider.js';
import { trendScoringService } from './trendScoringService.js';
import { trendAnalysisService } from './trendAnalysisService.js';
import { ApiError } from '../utils/ApiError.js';

export const trendResearchService = {
  /**
   * Returns current status of all source integration adapters
   */
  async getSourceStatuses() {
    const statuses = await Promise.all([
      googleTrendsProvider.getStatus(),
      webResearchProvider.getStatus(),
      metaAdsLibraryProvider.getStatus(),
      tiktokTrendsProvider.getStatus(),
      instagramTrendsProvider.getStatus(),
    ]);
    return statuses;
  },

  /**
   * Main trend research execution engine
   */
  async executeResearch(params, userContext = {}) {
    const {
      title,
      industry,
      region = 'India',
      platform = 'Cross-Platform Research',
      period = 'Last 7 Days',
      targetAudience = '',
      targetModule = 'personal-branding',
      targetCategory = '',
      contentObjective = '',
      brandOrCreator = '',
      competitorUrls = [],
      additionalInstructions = '',
      preferredLanguage = 'English',
    } = params;

    if (!industry) {
      throw new ApiError(400, 'Industry is required to research market trends');
    }

    const { userId = null, guestId = null } = userContext;

    // Determine date range
    const now = new Date();
    let daysBack = 7;
    if (period === 'Last 24 Hours') daysBack = 1;
    else if (period === 'Last 30 Days') daysBack = 30;
    else if (period === 'Last 90 Days') daysBack = 90;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const researchTitle = title?.trim() || `${industry} Market Trends (${region} • ${period})`;

    // Select which providers to query based on platform selection
    const providersToQuery = [];
    if (platform === 'Cross-Platform Research' || platform === 'Cross-Platform') {
      providersToQuery.push(googleTrendsProvider, webResearchProvider, metaAdsLibraryProvider, tiktokTrendsProvider, instagramTrendsProvider);
    } else if (platform.includes('Google')) {
      providersToQuery.push(googleTrendsProvider, webResearchProvider);
    } else if (platform.includes('Meta') || platform.includes('Facebook')) {
      providersToQuery.push(metaAdsLibraryProvider, webResearchProvider);
    } else if (platform.includes('Instagram')) {
      providersToQuery.push(instagramTrendsProvider, metaAdsLibraryProvider);
    } else if (platform.includes('TikTok')) {
      providersToQuery.push(tiktokTrendsProvider, webResearchProvider);
    } else if (platform.includes('YouTube')) {
      providersToQuery.push(googleTrendsProvider, tiktokTrendsProvider);
    } else {
      providersToQuery.push(googleTrendsProvider, webResearchProvider, metaAdsLibraryProvider);
    }

    // Execute provider research in parallel with safety
    const providerResponses = await Promise.all(
      providersToQuery.map(async (provider) => {
        try {
          return await provider.research({
            industry,
            region,
            period,
            query: additionalInstructions || '',
          });
        } catch (provErr) {
          return {
            sourceName: provider.name,
            status: 'Unavailable',
            count: 0,
            queryUsed: industry,
            latencyMs: 0,
            message: provErr.message,
            trends: [],
          };
        }
      })
    );

    // Collect source execution stats
    const sourceResults = providerResponses.map((res) => ({
      sourceName: res.sourceName,
      status: res.status,
      count: res.count || 0,
      queryUsed: res.queryUsed || industry,
      latencyMs: res.latencyMs || 0,
      message: res.message || '',
    }));

    // Aggregate trends from all providers
    const rawTrends = [];
    providerResponses.forEach((res) => {
      if (Array.isArray(res.trends)) {
        rawTrends.push(...res.trends);
      }
    });

    // Deduplicate trends by name similarity
    const seenNames = new Set();
    const uniqueTrends = [];
    for (const item of rawTrends) {
      const normalized = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenNames.has(normalized)) {
        seenNames.add(normalized);
        uniqueTrends.push(item);
      }
    }

    // Create TrendResearch document first to get its ID
    const researchDoc = new TrendResearch({
      userId,
      guestId,
      title: researchTitle,
      industry,
      region,
      platform,
      period,
      targetAudience,
      targetModule,
      targetCategory,
      contentObjective,
      brandOrCreator,
      competitorUrls,
      additionalInstructions,
      preferredLanguage,
      dateRangeUsed: {
        start: startDate,
        end: now,
        label: period,
      },
      sourceResults,
      totalTrendsCount: uniqueTrends.length,
      status: uniqueTrends.length > 0 ? 'Completed' : 'Partial',
    });

    await researchDoc.save();

    // Enrich and save each Trend into the database
    const savedTrendIds = [];
    const savedTrends = [];

    for (const raw of uniqueTrends) {
      // Analyze across sections
      const analysis = trendAnalysisService.analyzeTrend(raw);

      // Score momentum & opportunity
      const momentum = trendScoringService.calculateMomentumScore(raw);
      const opportunity = trendScoringService.calculateOpportunityScore({
        ...raw,
        momentumScore: momentum.score,
        relevantCategories: analysis.relevantCategories,
        relevantModules: analysis.relevantModules,
      });

      const trendDoc = new Trend({
        userId,
        guestId,
        researchId: researchDoc._id,
        name: raw.name,
        description: raw.description,
        industry: raw.industry || industry,
        platform: raw.platform || platform,
        region: raw.region || region,
        source: raw.source,
        sourceUrl: raw.sourceUrl || '',
        observationPeriod: period,
        firstObservedAt: raw.firstObservedAt || now,
        lastVerifiedAt: raw.lastVerifiedAt || now,
        verifiedMetrics: raw.verifiedMetrics || {},
        lifecycle: raw.lifecycle || 'Growing',
        lifecycleEvidence: raw.lifecycleEvidence || '',
        momentumScore: momentum.score,
        momentumScoreExplanation: momentum.explanation,
        opportunityScore: opportunity.score,
        opportunityScoreExplanation: opportunity.explanation,
        saturation: raw.saturation || 'Moderate Saturation',
        saturationEvidence: raw.saturationEvidence || '',
        relevantModules: analysis.relevantModules,
        relevantCategories: analysis.relevantCategories,
        researchEvidence: raw.researchEvidence || {},
        audienceAnalysis: analysis.audienceAnalysis,
        contentOpportunity: analysis.contentOpportunity,
        crossModuleMapping: analysis.crossModuleMapping,
        dataFreshnessStatus: 'Verified Fresh',
        tags: raw.tags || [],
      });

      const saved = await trendDoc.save();
      savedTrendIds.push(saved._id);
      savedTrends.push(saved);
    }

    // Generate comprehensive research summary recommendations
    const topModules = Array.from(new Set(savedTrends.flatMap((t) => t.relevantModules)));
    const topCategories = Array.from(new Set(savedTrends.flatMap((t) => t.relevantCategories))).slice(0, 8);
    const contentIdeas = savedTrends.slice(0, 5).map((t) => `${t.name}: ${t.contentOpportunity?.whyItMatters || t.description}`);

    const bestPersonalBranding = savedTrends
      .filter((t) => t.relevantModules.includes('personal-branding'))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 4)
      .map((t) => t.name);

    const bestMetaAds = savedTrends
      .filter((t) => t.relevantModules.includes('meta-ads'))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 4)
      .map((t) => t.name);

    const bestStoryMarketing = savedTrends
      .filter((t) => t.relevantModules.includes('story-marketing'))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 4)
      .map((t) => t.name);

    researchDoc.trendsDiscovered = savedTrendIds;
    researchDoc.totalTrendsCount = savedTrends.length;
    researchDoc.analysisSummary = `Identified ${savedTrends.length} high-signal trends across ${providersToQuery.length} sources for ${industry} in ${region}. Top opportunities concentrated in ${topCategories.slice(0, 4).join(', ')}.`;
    researchDoc.recommendations = {
      topModules,
      topCategories,
      contentIdeas,
      bestTrendsForPersonalBranding: bestPersonalBranding,
      bestTrendsForMetaAds: bestMetaAds,
      bestTrendsForStoryMarketing: bestStoryMarketing,
    };

    await researchDoc.save();

    return {
      research: researchDoc,
      trends: savedTrends,
    };
  },

  /**
   * Manual Trend Import
   */
  async importTrend(trendData, userContext = {}) {
    const { userId = null, guestId = null } = userContext;

    if (!trendData.name || !trendData.industry) {
      throw new ApiError(400, 'Trend name and industry are required for manual import');
    }

    const analysis = trendAnalysisService.analyzeTrend(trendData);
    const momentum = trendScoringService.calculateMomentumScore(trendData);
    const opportunity = trendScoringService.calculateOpportunityScore({
      ...trendData,
      momentumScore: momentum.score,
      relevantCategories: analysis.relevantCategories,
      relevantModules: analysis.relevantModules,
    });

    const newTrend = new Trend({
      userId,
      guestId,
      name: trendData.name.trim(),
      description: trendData.description || `User-imported trend for ${trendData.industry}`,
      industry: trendData.industry,
      platform: trendData.platform || 'Cross-Platform',
      region: trendData.region || 'India',
      source: 'Manual Import',
      sourceUrl: trendData.sourceUrl || '',
      observationPeriod: trendData.observationPeriod || 'Last 7 Days',
      firstObservedAt: trendData.firstObservedAt || new Date(),
      lastVerifiedAt: new Date(),
      verifiedMetrics: trendData.verifiedMetrics || {
        searchInterestChange: trendData.searchInterestChange || 'Imported by creator',
        hashtagViews: trendData.hashtagViews || '',
        activeAdCount: trendData.activeAdCount || '',
      },
      lifecycle: trendData.lifecycle || 'Growing',
      lifecycleEvidence: trendData.lifecycleEvidence || 'Imported with user-provided market observations.',
      momentumScore: momentum.score,
      momentumScoreExplanation: momentum.explanation,
      opportunityScore: opportunity.score,
      opportunityScoreExplanation: opportunity.explanation,
      saturation: trendData.saturation || 'Moderate Saturation',
      saturationEvidence: trendData.saturationEvidence || 'Imported based on creator domain assessment.',
      relevantModules: trendData.relevantModules || analysis.relevantModules,
      relevantCategories: trendData.relevantCategories || analysis.relevantCategories,
      researchEvidence: {
        supportingLinks: trendData.sourceUrl
          ? [{ title: trendData.name, url: trendData.sourceUrl, source: 'Manual Import', publishedAt: new Date(), snippet: 'Imported reference link' }]
          : [],
        verifiedMetricsSummary: 'Imported with verified creator observation.',
        inferredOpportunity: trendData.opportunityNotes || 'High custom relevance to current production schedule.',
        confidenceLevel: 'High',
        confidenceJustification: 'Directly verified and submitted by creator.',
      },
      audienceAnalysis: analysis.audienceAnalysis,
      contentOpportunity: analysis.contentOpportunity,
      crossModuleMapping: analysis.crossModuleMapping,
      dataFreshnessStatus: 'Imported',
      isSaved: true,
      tags: trendData.tags || ['imported'],
    });

    return await newTrend.save();
  },

  /**
   * Retrieves research history list
   */
  async getResearchHistory(query = {}, userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = {};

    if (userId) {
      filter.$or = [{ userId }, { guestId }];
    } else if (guestId) {
      filter.guestId = guestId;
    }

    if (query.industry && query.industry !== 'All') {
      filter.industry = query.industry;
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      TrendResearch.find(filter)
        .populate('trendsDiscovered', 'name industry platform lifecycle opportunityScore momentumScore source isSaved')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TrendResearch.countDocuments(filter),
    ]);

    return {
      history: items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Retrieves a single research record by ID
   */
  async getResearchById(id, userContext = {}) {
    const research = await TrendResearch.findById(id)
      .populate('trendsDiscovered')
      .lean();

    if (!research) {
      throw new ApiError(404, 'Trend research session not found');
    }

    return research;
  },
};
