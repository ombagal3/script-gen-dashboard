import mongoose from 'mongoose';

const dataSourceSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'youtube-trends',
        'instagram-trends',
        'tiktok-creative-center',
        'google-trends',
        'meta-ads-library',
        'web-research',
        'gemini-ai',
      ],
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Video & Shorts', 'Social & Reels', 'Short-Form Viral', 'Search Demand', 'Paid Advertising', 'Web & News', 'Generative AI & LLM'],
      default: 'Video & Shorts',
    },
    credentials: {
      apiKey: { type: String, default: '' },
      token: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: [
        'Connected',
        'Not Configured',
        'Authentication Required',
        'Limited Access',
        'Rate Limited',
        'Error',
        'Disconnected',
      ],
      default: 'Not Configured',
      index: true,
    },
    requiresAuth: {
      type: Boolean,
      default: false,
    },
    availableFeatures: {
      type: [String],
      default: [],
    },
    limitations: {
      type: [String],
      default: [],
    },
    lastSyncAt: {
      type: Date,
      default: null,
    },
    lastAttemptAt: {
      type: Date,
      default: null,
    },
    lastSuccessLatencyMs: {
      type: Number,
      default: 0,
    },
    lastError: {
      type: String,
      default: null,
    },
    recordCount: {
      type: Number,
      default: 0,
    },
    documentationUrl: {
      type: String,
      default: '',
    },
    configSummary: {
      isConfigured: { type: Boolean, default: false },
      maskedKey: { type: String, default: '' },
      environmentVarName: { type: String, default: '' },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

export const DataSource = mongoose.model('DataSource', dataSourceSchema);
