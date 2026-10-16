import { AutopilotJob } from '../models/AutopilotJob.js';
import { AutopilotBrief } from '../models/AutopilotBrief.js';
import { contentStrategyService } from './contentStrategyService.js';
import { trendResearchService } from './trendResearchService.js';
import { trendSynthesisService } from './trendSynthesisService.js';
import { youtubeTrendsProvider } from '../integrations/youtubeTrendsProvider.js';
import { googleTrendsProvider } from '../integrations/googleTrendsProvider.js';
import { webResearchProvider } from '../integrations/webResearchProvider.js';
import { metaAdsLibraryProvider } from '../integrations/metaAdsLibraryProvider.js';
import { tiktokTrendsProvider } from '../integrations/tiktokTrendsProvider.js';
import { instagramTrendsProvider } from '../integrations/instagramTrendsProvider.js';

export const researchSchedulerService = {
  activeJobs: new Map(),

  /**
   * Executes a full autopilot research scan for the active or specified strategy
   */
  async runAutopilotScan(strategyId = null, jobType = 'Manual On-Demand', userContext = {}) {
    const { userId = null, guestId = null } = userContext;

    // 1. Resolve strategy
    let strategy;
    if (strategyId) {
      strategy = await contentStrategyService.getAllStrategies(userContext).then((list) =>
        list.find((s) => s._id.toString() === strategyId)
      );
    }
    if (!strategy) {
      strategy = await contentStrategyService.getActiveStrategy(userContext);
    }

    if (!strategy) {
      throw new Error('No active content strategy profile found');
    }

    const jobKey = strategy._id.toString();
    if (this.activeJobs.has(jobKey)) {
      return {
        message: 'An autopilot research job is already running for this brand profile',
        jobId: this.activeJobs.get(jobKey),
        isRunning: true,
      };
    }

    // 2. Create job log
    const startTime = Date.now();
    const job = new AutopilotJob({
      strategyId: strategy._id,
      brandName: strategy.brandName,
      userId,
      guestId,
      jobType,
      status: 'In Progress',
      startedAt: new Date(),
      logs: [
        `[${new Date().toLocaleTimeString()}] Initialized Autopilot Research for: ${strategy.brandName}`,
        `[${new Date().toLocaleTimeString()}] Target Niche: ${strategy.primaryNiche} (${strategy.country} • ${strategy.preferredLanguage})`,
      ],
    });
    await job.save();
    this.activeJobs.set(jobKey, job._id.toString());

    try {
      // 3. Multi-source research polling
      job.logs.push(`[${new Date().toLocaleTimeString()}] Polling 6 verified data sources...`);

      const queryTerm = `${strategy.primaryNiche} ${strategy.subNiche || ''}`.trim();
      const providers = [
        googleTrendsProvider,
        webResearchProvider,
        metaAdsLibraryProvider,
        youtubeTrendsProvider,
        tiktokTrendsProvider,
        instagramTrendsProvider,
      ];

      const polledSources = [];
      const extractedTrends = [];

      for (const prov of providers) {
        try {
          const res = await prov.research({
            industry: strategy.industry,
            region: strategy.country,
            period: 'Last 7 Days',
            query: queryTerm,
          });

          polledSources.push({
            name: prov.name,
            status: res.status,
            trendsExtracted: res.count || 0,
            latencyMs: res.latencyMs || 0,
          });

          if (Array.isArray(res.trends)) {
            extractedTrends.push(...res.trends);
          }
          job.logs.push(`[${new Date().toLocaleTimeString()}] ${prov.name}: Extracted ${res.count || 0} signals (${res.status})`);
        } catch (provErr) {
          polledSources.push({
            name: prov.name,
            status: 'Degraded',
            trendsExtracted: 0,
            latencyMs: 0,
          });
          job.logs.push(`[${new Date().toLocaleTimeString()}] ${prov.name} warning: ${provErr.message}`);
        }
      }

      job.sourcesPolled = polledSources;

      // 4. Synthesize into 3 daily production briefs
      job.logs.push(`[${new Date().toLocaleTimeString()}] Synthesizing patterns into Best, Alternative & Evergreen Briefs...`);
      const { briefs } = await trendSynthesisService.synthesizeDailyBriefs(extractedTrends, strategy, userContext);

      // 5. Complete Job
      job.status = 'Completed';
      job.completedAt = new Date();
      job.durationMs = Date.now() - startTime;
      job.briefsGeneratedCount = briefs.length;
      job.briefIds = briefs.map((b) => b._id);
      job.logs.push(`[${new Date().toLocaleTimeString()}] Production packages ready: ${briefs.length} briefs created with full shooting & editing scripts.`);
      await job.save();

      this.activeJobs.delete(jobKey);

      return {
        job,
        briefs,
        strategy,
      };
    } catch (err) {
      job.status = 'Failed';
      job.completedAt = new Date();
      job.durationMs = Date.now() - startTime;
      job.errorMessage = err.message;
      job.logs.push(`[${new Date().toLocaleTimeString()}] Fatal error: ${err.message}`);
      await job.save();

      this.activeJobs.delete(jobKey);
      throw err;
    }
  },

  /**
   * Retrieves latest briefs for the active strategy
   */
  async getDailyBriefs(query = {}, userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = {};

    if (userId) filter.$or = [{ userId }, { guestId }];
    else if (guestId) filter.guestId = guestId;

    if (query.strategyId) filter.strategyId = query.strategyId;
    if (query.status && query.status !== 'All') filter.status = query.status;
    if (query.priorityRank && query.priorityRank !== 'All') filter.priorityRank = query.priorityRank;

    const briefs = await AutopilotBrief.find(filter)
      .sort({ createdAt: -1 })
      .limit(query.limit ? Number(query.limit) : 20)
      .lean();

    return briefs;
  },

  /**
   * Get single brief by ID
   */
  async getBriefById(id) {
    const brief = await AutopilotBrief.findById(id).lean();
    if (!brief) throw new Error('Brief not found');
    return brief;
  },

  /**
   * Update brief status (1-click transition)
   */
  async updateBriefStatus(id, newStatus) {
    const validStatuses = [
      'Researching',
      'Research Complete',
      'Script Ready',
      'Ready to Shoot',
      'Shooting',
      'Editing',
      'Ready to Upload',
      'Published',
      'Performance Review',
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const brief = await AutopilotBrief.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );
    if (!brief) throw new Error('Brief not found');
    return brief;
  },

  /**
   * Update brief details (e.g. edited script, shooting notes, performance feedback)
   */
  async updateBrief(id, updateData) {
    const brief = await AutopilotBrief.findByIdAndUpdate(id, updateData, { new: true });
    if (!brief) throw new Error('Brief not found');
    return brief;
  },

  /**
   * Get job history
   */
  async getJobHistory(userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = userId ? { $or: [{ userId }, { guestId }] } : { guestId };

    const jobs = await AutopilotJob.find(filter)
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();
    return jobs;
  },
};
