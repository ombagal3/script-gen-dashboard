import mongoose from 'mongoose';

const referenceVideoSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ['YouTube', 'YouTube Shorts', 'Instagram Reels', 'TikTok', 'Meta Ad'],
      index: true,
    },
    videoId: {
      type: String,
      default: '',
      index: true,
    },
    canonicalUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    creatorName: {
      type: String,
      default: 'Unknown Creator',
    },
    channelUrl: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    retrievedAt: {
      type: Date,
      default: Date.now,
    },
    durationSeconds: {
      type: Number,
      default: 60,
    },
    isShortForm: {
      type: Boolean,
      default: true,
    },
    metrics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      estimatedEngagementRate: { type: String, default: '' },
      metricsSource: { type: String, default: 'Public API / Snapshot' },
      isEstimated: { type: Boolean, default: false },
    },
    caption: {
      type: String,
      default: '',
    },
    transcript: {
      type: String,
      default: '',
    },
    hasRealTranscript: {
      type: Boolean,
      default: false,
    },
    analysis: {
      hookText: { type: String, default: '' },
      hookStyle: { type: String, default: '' },
      openingStructure: { type: String, default: '' },
      audienceProblem: { type: String, default: '' },
      coreArgumentOrStory: { type: String, default: '' },
      callToAction: { type: String, default: '' },
      visualPacingStyle: { type: String, default: '' },
      analysisDepth: {
        type: String,
        enum: ['Full Video & Transcript', 'Metadata & Description', 'Observed Public Pattern'],
        default: 'Metadata & Description',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    industry: {
      type: String,
      default: '',
      index: true,
    },
    trendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trend',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

referenceVideoSchema.index({ platform: 1, publishedAt: -1 });

export const ReferenceVideo = mongoose.model('ReferenceVideo', referenceVideoSchema);
