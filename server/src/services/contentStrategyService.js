import { ContentStrategy } from '../models/ContentStrategy.js';
import { ApiError } from '../utils/ApiError.js';

export const contentStrategyService = {
  /**
   * Retrieves active strategy, or creates default profile if none exists
   */
  async getActiveStrategy(userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = userId ? { $or: [{ userId }, { guestId }] } : { guestId };

    let strategy = await ContentStrategy.findOne({ ...filter, isActive: true });

    if (!strategy) {
      // Find any strategy first
      strategy = await ContentStrategy.findOne(filter);
      if (strategy) {
        strategy.isActive = true;
        await strategy.save();
      } else {
        // Pre-seed a rich default strategy
        strategy = await this.createDefaultStrategy(userContext);
      }
    }

    return strategy;
  },

  /**
   * List all configured brand / strategy profiles
   */
  async getAllStrategies(userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = userId ? { $or: [{ userId }, { guestId }] } : { guestId };

    const list = await ContentStrategy.find(filter).sort({ isActive: -1, updatedAt: -1 });
    if (list.length === 0) {
      const defaultOne = await this.createDefaultStrategy(userContext);
      return [defaultOne];
    }
    return list;
  },

  /**
   * Creates a default content strategy profile
   */
  async createDefaultStrategy(userContext = {}) {
    const { userId = null, guestId = null } = userContext;

    const defaultStrategy = new ContentStrategy({
      userId,
      guestId,
      brandName: 'Authority Creator Hub',
      isActive: true,
      primaryNiche: 'Taxation & Financial Planning',
      subNiche: 'New vs Old Tax Regime, Deductions & Salaried Wealth Building',
      industry: 'Finance and Taxation',
      country: 'India',
      city: 'Pan-India / Metro Hubs',
      targetAudience: 'Salaried professionals (25-45), startup founders, and freelancers',
      preferredLanguage: 'Hinglish',
      primaryPlatform: 'Instagram Reels',
      secondaryPlatforms: ['YouTube Shorts', 'Instagram Stories', 'Meta Ads'],
      module: 'personal-branding',
      contentObjective: 'Authority and Trust',
      postingFrequency: 'Daily',
      typicalDuration: 60,
      availableEquipment: [
        'Smartphone only (iPhone / Android HD)',
        'Tripod with Ring Light',
        'Wireless Lapel Mic',
      ],
      presentationPreference: 'On-Camera Talking Head',
      brandGuidelines:
        'Speak like a trusted financial advisor and empathetic friend. Break down legal & tax complexities into clear 3-step action points. Never sound robotic or arrogant.',
      restrictedClaims: [
        'Never guarantee 100% tax evasion or absolute zero tax',
        'No unverified return promises or crypto schemes',
        'Cite Income Tax Act sections accurately',
      ],
      competitorHandles: ['@taxbuddy', '@finshots', '@ca_rachana_phadke'],
      connectedAccountInsights: {
        accountHandle: '@authority_creator_demo',
        followersCount: 24500,
        baselineEngagementRate: '4.8%',
        topActiveHours: ['7:00 PM - 9:00 PM', '12:30 PM - 2:00 PM'],
        isConnected: true,
      },
      scheduleSettings: {
        enabled: true,
        runTime: '08:00 AM',
        frequency: 'Daily',
        autoGenerateBriefs: true,
      },
    });

    return await defaultStrategy.save();
  },

  /**
   * Create a new brand profile
   */
  async createStrategy(data, userContext = {}) {
    const { userId = null, guestId = null } = userContext;

    if (!data.brandName || !data.primaryNiche) {
      throw new ApiError(400, 'Brand name and primary niche are required');
    }

    // If marked active, deactivate others
    if (data.isActive) {
      const filter = userId ? { $or: [{ userId }, { guestId }] } : { guestId };
      await ContentStrategy.updateMany(filter, { isActive: false });
    }

    const strategy = new ContentStrategy({
      ...data,
      userId,
      guestId,
    });

    return await strategy.save();
  },

  /**
   * Update an existing strategy profile
   */
  async updateStrategy(id, updateData, userContext = {}) {
    const strategy = await ContentStrategy.findById(id);
    if (!strategy) {
      throw new ApiError(404, 'Content strategy profile not found');
    }

    // If activating this strategy, deactivate all others for this user
    if (updateData.isActive && !strategy.isActive) {
      const { userId = null, guestId = null } = userContext;
      const filter = userId ? { $or: [{ userId }, { guestId }] } : { guestId };
      await ContentStrategy.updateMany(filter, { isActive: false });
    }

    Object.assign(strategy, updateData);
    return await strategy.save();
  },

  /**
   * Switch the active profile
   */
  async setActiveStrategy(id, userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = userId ? { $or: [{ userId }, { guestId }] } : { guestId };

    await ContentStrategy.updateMany(filter, { isActive: false });
    const strategy = await ContentStrategy.findByIdAndUpdate(id, { isActive: true }, { new: true });

    if (!strategy) {
      throw new ApiError(404, 'Strategy profile not found');
    }

    return strategy;
  },

  /**
   * Delete a strategy
   */
  async deleteStrategy(id) {
    const strategy = await ContentStrategy.findById(id);
    if (!strategy) {
      throw new ApiError(404, 'Strategy profile not found');
    }

    await ContentStrategy.findByIdAndDelete(id);
    return { success: true, message: 'Content strategy deleted successfully' };
  },
};
