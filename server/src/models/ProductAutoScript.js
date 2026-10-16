import mongoose from 'mongoose';

const sourceResultSchema = new mongoose.Schema(
  {
    sourceName: { type: String, required: true },
    status: { type: String, default: 'Connected' },
    count: { type: Number, default: 0 },
    queryUsed: { type: String, default: '' },
    latencyMs: { type: Number, default: 0 },
    message: { type: String, default: '' },
    accessLimitations: { type: String, default: '' },
    retrievedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const referenceVideoSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    source: { type: String, default: '' },
    url: { type: String, default: '' },
    creatorName: { type: String, default: '' },
    channelUrl: { type: String, default: '' },
    publishedAt: { type: Date },
    durationSeconds: { type: Number, default: 0 },
    metrics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      estimatedEngagementRate: { type: String, default: '' },
      metricsSource: { type: String, default: 'Observed Reference' },
      isEstimated: { type: Boolean, default: false },
    },
    hookStyle: { type: String, default: '' },
    visualStructure: { type: String, default: '' },
    pacing: { type: String, default: '' },
    ctaStyle: { type: String, default: '' },
    analysisDepth: { type: String, default: 'Metadata & Public Data' },
  },
  { _id: false }
);

const productAutoScriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    productName: {
      type: String,
      required: [true, 'Product Name is required'],
      trim: true,
      index: true,
    },
    productUrl: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '',
    },
    benefits: {
      type: String,
      default: '',
    },
    painPoints: {
      type: String,
      default: '',
    },
    module: {
      type: String,
      enum: ['personal-branding', 'meta-ads', 'story-marketing'],
      default: 'personal-branding',
      index: true,
    },
    platform: {
      type: String,
      default: 'Instagram Reels',
    },
    targetMarket: {
      type: String,
      default: 'India',
    },
    language: {
      type: String,
      default: 'English',
    },
    dateRange: {
      type: String,
      default: 'Last 7 Days',
    },
    autoScriptEnabled: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Researching', 'Analyzing', 'GeneratingPrompt', 'GeneratingScript', 'Completed', 'Failed'],
      default: 'Completed',
      index: true,
    },
    searchQueries: {
      type: [String],
      default: [],
    },
    sourcesSearched: {
      type: [sourceResultSchema],
      default: [],
    },
    referenceVideos: {
      type: [referenceVideoSchema],
      default: [],
    },
    creativePatterns: {
      recurringPatterns: { type: [String], default: [] },
      contentGaps: { type: [String], default: [] },
      recurringHooks: { type: [String], default: [] },
      differentiatingOpportunities: { type: [String], default: [] },
      visualFraming: { type: [String], default: [] },
    },
    masterPromptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterPrompt',
      default: null,
      index: true,
    },
    masterPromptText: {
      type: String,
      default: '',
    },
    scriptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Script',
      default: null,
      index: true,
    },
    generatedScript: {
      title: { type: String, default: '' },
      hookOptions: [
        {
          type: { type: String, default: '' },
          hookText: { type: String, default: '' },
          whyItWorks: { type: String, default: '' },
          estimatedRetentionLift: { type: String, default: '' },
        },
      ],
      recommendedHook: { type: String, default: '' },
      spokenScript: { type: String, default: '' },
      body: { type: String, default: '' },
      cta: { type: String, default: '' },
      shootingInstructions: {
        cameraFraming: { type: String, default: '' },
        lighting: { type: String, default: '' },
        wardrobe: { type: String, default: '' },
        teleprompterNotes: { type: String, default: '' },
        bRollSuggestions: { type: [String], default: [] },
        scenes: [
          {
            sceneNumber: { type: Number },
            shotType: { type: String },
            visualAction: { type: String },
            dialogue: { type: String },
            durationSeconds: { type: Number },
          },
        ],
      },
      editingInstructions: {
        cutsAndPacing: { type: String, default: '' },
        captionStyle: { type: String, default: '' },
        onScreenText: { type: [String], default: [] },
        soundEffects: [
          {
            timestamp: { type: String },
            effectName: { type: String },
          },
        ],
      },
      uploadPackage: {
        caption: { type: String, default: '' },
        hashtags: { type: [String], default: [] },
        coverTitle: { type: String, default: '' },
        suggestedPublishingTime: { type: String, default: '' },
      },
    },
    executionDurationMs: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

productAutoScriptSchema.index({ userId: 1, createdAt: -1 });
productAutoScriptSchema.index({ guestId: 1, createdAt: -1 });

export const ProductAutoScript = mongoose.model('ProductAutoScript', productAutoScriptSchema);
