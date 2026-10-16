import mongoose from 'mongoose';

const sourceResultSchema = new mongoose.Schema(
  {
    sourceName: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'Connected',
        'Degraded',
        'Unavailable',
        'Manual Only',
        'Cached',
        'Limited Access',
        'Not Configured',
        'Authentication Required',
        'Rate Limited',
        'Error',
      ],
      default: 'Connected',
    },
    count: { type: Number, default: 0 },
    queryUsed: { type: String, default: '' },
    latencyMs: { type: Number, default: 0 },
    message: { type: String, default: '' },
  },
  { _id: false }
);

const trendResearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Research title is required'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      index: true,
    },
    brandOrCreator: {
      type: String,
      default: '',
    },
    targetAudience: {
      type: String,
      default: '',
    },
    region: {
      type: String,
      default: 'India',
    },
    preferredLanguage: {
      type: String,
      default: 'English',
    },
    platform: {
      type: String,
      default: 'Cross-Platform Research',
    },
    period: {
      type: String,
      default: 'Last 7 Days',
    },
    targetModule: {
      type: String,
      default: 'personal-branding',
    },
    targetCategory: {
      type: String,
      default: '',
    },
    contentObjective: {
      type: String,
      default: '',
    },
    competitorUrls: {
      type: [String],
      default: [],
    },
    additionalInstructions: {
      type: String,
      default: '',
    },
    dateRangeUsed: {
      start: { type: Date, default: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      end: { type: Date, default: () => new Date() },
      label: { type: String, default: 'Last 7 Days' },
    },
    sourceResults: {
      type: [sourceResultSchema],
      default: [],
    },
    trendsDiscovered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend',
      },
    ],
    totalTrendsCount: {
      type: Number,
      default: 0,
    },
    analysisSummary: {
      type: String,
      default: '',
    },
    recommendations: {
      topModules: { type: [String], default: [] },
      topCategories: { type: [String], default: [] },
      contentIdeas: { type: [String], default: [] },
      bestTrendsForPersonalBranding: { type: [String], default: [] },
      bestTrendsForMetaAds: { type: [String], default: [] },
      bestTrendsForStoryMarketing: { type: [String], default: [] },
    },
    status: {
      type: String,
      enum: ['Completed', 'Partial', 'Failed'],
      default: 'Completed',
    },
  },
  {
    timestamps: true,
  }
);

trendResearchSchema.index({ userId: 1, createdAt: -1 });
trendResearchSchema.index({ guestId: 1, createdAt: -1 });
trendResearchSchema.index({ industry: 1, createdAt: -1 });

export const TrendResearch = mongoose.model('TrendResearch', trendResearchSchema);
