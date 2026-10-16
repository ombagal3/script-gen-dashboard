import mongoose from 'mongoose';

const verifiedMetricsSchema = new mongoose.Schema(
  {
    searchInterestChange: { type: String, default: '' },
    searchVolumeEstimate: { type: String, default: '' },
    hashtagViews: { type: String, default: '' },
    activeAdCount: { type: String, default: '' },
    recentArticlesCount: { type: Number, default: 0 },
    engagementRateEstimate: { type: String, default: '' },
    rawData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const audienceAnalysisSchema = new mongoose.Schema(
  {
    targetAudience: { type: String, default: '' },
    audienceProblem: { type: String, default: '' },
    searchIntent: { type: String, default: '' },
    commonQuestions: { type: [String], default: [] },
    emotionalMotivation: { type: String, default: '' },
    contentRelevance: { type: String, default: '' },
  },
  { _id: false }
);

const contentOpportunitySchema = new mongoose.Schema(
  {
    whyItMatters: { type: String, default: '' },
    whyNow: { type: String, default: '' },
    missingFromExistingContent: { type: String, default: '' },
    originalAngles: { type: [String], default: [] },
    suitableFormats: { type: [String], default: [] },
    potentialRisks: { type: [String], default: [] },
    recommendedAction: {
      type: String,
      enum: ['Create Now', 'Research Further', 'Skip'],
      default: 'Create Now',
    },
  },
  { _id: false }
);

const crossModuleMappingSchema = new mongoose.Schema(
  {
    personalBranding: {
      isRecommended: { type: Boolean, default: false },
      recommendedCategories: { type: [String], default: [] },
      angle: { type: String, default: '' },
      hookIdea: { type: String, default: '' },
      ctaStyle: { type: String, default: '' },
    },
    metaAds: {
      isRecommended: { type: Boolean, default: false },
      recommendedCategories: { type: [String], default: [] },
      angle: { type: String, default: '' },
      creativeFormat: { type: String, default: '' },
      complianceNote: { type: String, default: '' },
    },
    storyMarketing: {
      isRecommended: { type: Boolean, default: false },
      recommendedCategories: { type: [String], default: [] },
      sequenceIdea: { type: String, default: '' },
      suggestedSlideCount: { type: Number, default: 4 },
      stickerStrategy: { type: String, default: '' },
    },
    scriptDefinition: {
      recommendedMethodName: { type: String, default: 'Hook → Problem → Explanation → Solution → CTA' },
      hookStyle: { type: String, default: 'Curiosity Gap' },
      bodyStructure: { type: String, default: '3-point educational breakdown' },
      ctaType: { type: String, default: 'Save & Comment' },
    },
  },
  { _id: false }
);

const trendEvidenceSchema = new mongoose.Schema(
  {
    supportingLinks: [
      {
        title: { type: String, default: '' },
        url: { type: String, required: true },
        source: { type: String, default: '' },
        publishedAt: { type: Date, default: null },
        snippet: { type: String, default: '' },
      },
    ],
    verifiedMetricsSummary: { type: String, default: '' },
    inferredOpportunity: { type: String, default: '' },
    missingInformation: { type: String, default: '' },
    confidenceLevel: {
      type: String,
      enum: ['High', 'Moderate', 'Preliminary / Inferred'],
      default: 'Moderate',
    },
    confidenceJustification: { type: String, default: '' },
  },
  { _id: false }
);

const trendSchema = new mongoose.Schema(
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
    researchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrendResearch',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Trend name is required'],
      trim: true,
      maxlength: [250, 'Trend name cannot exceed 250 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      index: true,
    },
    platform: {
      type: String,
      default: 'Cross-Platform',
      index: true,
    },
    region: {
      type: String,
      default: 'India',
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: [
        'Google Trends',
        'TikTok Creative Center',
        'Instagram Explore',
        'Meta Ads Library',
        'Google News / Web Research',
        'Manual Import',
        'Cross-Source Synthesis',
      ],
      index: true,
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    observationPeriod: {
      type: String,
      default: 'Last 7 Days',
    },
    firstObservedAt: {
      type: Date,
      default: Date.now,
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedMetrics: {
      type: verifiedMetricsSchema,
      default: () => ({}),
    },
    lifecycle: {
      type: String,
      enum: ['Emerging', 'Growing', 'Peak', 'Declining', 'Evergreen'],
      default: 'Growing',
      index: true,
    },
    lifecycleEvidence: {
      type: String,
      default: 'Based on search interest momentum and cross-platform frequency.',
    },
    momentumScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    momentumScoreExplanation: {
      type: String,
      default: '',
    },
    opportunityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    opportunityScoreExplanation: {
      type: String,
      default: '',
    },
    saturation: {
      type: String,
      enum: ['Low Saturation', 'Moderate Saturation', 'High Saturation', 'Unknown'],
      default: 'Moderate Saturation',
      index: true,
    },
    saturationEvidence: {
      type: String,
      default: '',
    },
    relevantModules: {
      type: [String],
      default: ['personal-branding'],
      index: true,
    },
    relevantCategories: {
      type: [String],
      default: [],
    },
    researchEvidence: {
      type: trendEvidenceSchema,
      default: () => ({}),
    },
    audienceAnalysis: {
      type: audienceAnalysisSchema,
      default: () => ({}),
    },
    contentOpportunity: {
      type: contentOpportunitySchema,
      default: () => ({}),
    },
    crossModuleMapping: {
      type: crossModuleMappingSchema,
      default: () => ({}),
    },
    isSaved: {
      type: Boolean,
      default: false,
      index: true,
    },
    dataFreshnessStatus: {
      type: String,
      enum: ['Verified Fresh', 'Recent', 'Stale / Needs Refresh', 'Imported', 'Estimated'],
      default: 'Verified Fresh',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

trendSchema.index({ userId: 1, createdAt: -1 });
trendSchema.index({ guestId: 1, createdAt: -1 });
trendSchema.index({ industry: 1, region: 1, createdAt: -1 });
trendSchema.index({ name: 'text', description: 'text' }, { default_language: 'none', language_override: 'none' });

export const Trend = mongoose.model('Trend', trendSchema);
