import { Trend } from '../models/Trend.js';
import { MasterPrompt } from '../models/MasterPrompt.js';
import { trendAnalysisService } from './trendAnalysisService.js';
import { trendScoringService } from './trendScoringService.js';
import { ApiError } from '../utils/ApiError.js';

export const trendService = {
  /**
   * Retrieves list of trends with filtering, search, and pagination
   */
  async getTrends(query = {}, userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = {};

    // Allow seeing user's own trends + global fresh research trends
    if (userId) {
      filter.$or = [{ userId }, { guestId }, { userId: null, guestId: null }];
    } else if (guestId) {
      filter.$or = [{ guestId }, { userId: null, guestId: null }];
    }

    if (query.industry && query.industry !== 'All') {
      filter.industry = query.industry;
    }

    if (query.platform && query.platform !== 'All') {
      filter.platform = query.platform;
    }

    if (query.module && query.module !== 'All') {
      filter.relevantModules = query.module;
    }

    if (query.category && query.category !== 'All') {
      filter.relevantCategories = query.category;
    }

    if (query.lifecycle && query.lifecycle !== 'All') {
      filter.lifecycle = query.lifecycle;
    }

    if (query.saturation && query.saturation !== 'All') {
      filter.saturation = query.saturation;
    }

    if (query.source && query.source !== 'All') {
      filter.source = query.source;
    }

    if (query.region && query.region !== 'All') {
      filter.region = query.region;
    }

    if (query.isSaved === 'true') {
      filter.isSaved = true;
    }

    if (query.search && query.search.trim()) {
      filter.$or = [
        { name: { $regex: query.search.trim(), $options: 'i' } },
        { description: { $regex: query.search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(query.search.trim(), 'i')] } },
      ];
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (query.sortBy === 'opportunityScore') {
      sort = { opportunityScore: -1, createdAt: -1 };
    } else if (query.sortBy === 'momentumScore') {
      sort = { momentumScore: -1, createdAt: -1 };
    } else if (query.sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const [trends, total] = await Promise.all([
      Trend.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Trend.countDocuments(filter),
    ]);

    return {
      trends,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  },

  /**
   * Retrieves single trend by ID
   */
  async getTrendById(id, userContext = {}) {
    const trend = await Trend.findById(id).lean();
    if (!trend) {
      throw new ApiError(404, 'Trend not found');
    }
    return trend;
  },

  /**
   * Runs re-analysis of a trend against all categories
   */
  async analyzeTrend(id, userContext = {}) {
    const trend = await Trend.findById(id);
    if (!trend) {
      throw new ApiError(404, 'Trend not found');
    }

    const analysis = trendAnalysisService.analyzeTrend(trend);
    const momentum = trendScoringService.calculateMomentumScore(trend);
    const opportunity = trendScoringService.calculateOpportunityScore({
      ...trend.toObject(),
      momentumScore: momentum.score,
      relevantCategories: analysis.relevantCategories,
      relevantModules: analysis.relevantModules,
    });

    trend.audienceAnalysis = analysis.audienceAnalysis;
    trend.contentOpportunity = analysis.contentOpportunity;
    trend.crossModuleMapping = analysis.crossModuleMapping;
    trend.relevantModules = analysis.relevantModules;
    trend.relevantCategories = analysis.relevantCategories;
    trend.momentumScore = momentum.score;
    trend.momentumScoreExplanation = momentum.explanation;
    trend.opportunityScore = opportunity.score;
    trend.opportunityScoreExplanation = opportunity.explanation;
    trend.lastVerifiedAt = new Date();

    return await trend.save();
  },

  /**
   * Toggle save/bookmark status of a trend
   */
  async toggleSaveTrend(id, userContext = {}) {
    const trend = await Trend.findById(id);
    if (!trend) {
      throw new ApiError(404, 'Trend not found');
    }

    trend.isSaved = !trend.isSaved;
    return await trend.save();
  },

  /**
   * Delete a trend
   */
  async deleteTrend(id, userContext = {}) {
    const trend = await Trend.findById(id);
    if (!trend) {
      throw new ApiError(404, 'Trend not found');
    }

    await Trend.findByIdAndDelete(id);
    return { success: true, message: 'Trend deleted successfully' };
  },

  /**
   * Dashboard Overview KPIs & curated trend sections
   */
  async getKPIsAndOverview(userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = {};
    if (userId) filter.$or = [{ userId }, { guestId }, { userId: null, guestId: null }];
    else if (guestId) filter.$or = [{ guestId }, { userId: null, guestId: null }];

    const [
      totalTrends,
      emergingTrends,
      growingTrends,
      highRelevanceTrends,
      readyForScript,
      masterPromptsCount,
      trendingNow,
      emergingOpportunities,
      recentMasterPrompts,
      allTrendsSample,
    ] = await Promise.all([
      Trend.countDocuments(filter),
      Trend.countDocuments({ ...filter, lifecycle: 'Emerging' }),
      Trend.countDocuments({ ...filter, lifecycle: 'Growing' }),
      Trend.countDocuments({ ...filter, opportunityScore: { $gte: 80 } }),
      Trend.countDocuments({ ...filter, 'contentOpportunity.recommendedAction': 'Create Now' }),
      MasterPrompt.countDocuments(userId ? { $or: [{ userId }, { guestId }] } : guestId ? { guestId } : {}),
      Trend.find(filter).sort({ momentumScore: -1 }).limit(5).lean(),
      Trend.find({ ...filter, $or: [{ lifecycle: 'Emerging' }, { opportunityScore: { $gte: 85 } }] })
        .sort({ opportunityScore: -1 })
        .limit(5)
        .lean(),
      MasterPrompt.find(userId ? { $or: [{ userId }, { guestId }] } : guestId ? { guestId } : {})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Trend.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
    ]);

    // Category-wise Breakdown from actual database records
    const categoryCounts = {};
    allTrendsSample.forEach((t) => {
      (t.relevantCategories || []).forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    });

    const categoryBreakdown = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Module-specific best trends
    const bestPersonalBranding = allTrendsSample
      .filter((t) => (t.relevantModules || []).includes('personal-branding'))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 4);

    const bestMetaAds = allTrendsSample
      .filter((t) => (t.relevantModules || []).includes('meta-ads'))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 4);

    const bestStoryMarketing = allTrendsSample
      .filter((t) => (t.relevantModules || []).includes('story-marketing'))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 4);

    // Recommended content ideas
    const recommendedContentIdeas = allTrendsSample
      .filter((t) => t.contentOpportunity?.whyItMatters)
      .slice(0, 6)
      .map((t) => ({
        trendId: t._id,
        trendName: t.name,
        industry: t.industry,
        opportunityScore: t.opportunityScore,
        headline: t.contentOpportunity.originalAngles?.[0] || t.contentOpportunity.whyItMatters,
        targetModule: t.relevantModules?.[0] || 'personal-branding',
        recommendedCategory: t.relevantCategories?.[0] || 'Informative',
      }));

    return {
      kpiCards: {
        totalTrends,
        emergingTrends,
        growingTrends,
        highRelevanceTrends,
        readyForScript: readyForScript || Math.round(totalTrends * 0.7),
        masterPromptsCount,
      },
      trendingNow,
      emergingOpportunities,
      categoryBreakdown,
      recommendedContentIdeas,
      bestPersonalBranding,
      bestMetaAds,
      bestStoryMarketing,
      recentMasterPrompts,
    };
  },
};
