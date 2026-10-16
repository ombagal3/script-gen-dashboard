import mongoose from 'mongoose';

const contentStrategySchema = new mongoose.Schema(
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
    brandName: {
      type: String,
      required: [true, 'Brand or creator profile name is required'],
      trim: true,
      maxlength: [120, 'Brand name cannot exceed 120 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    primaryNiche: {
      type: String,
      required: [true, 'Primary niche is required'],
      trim: true,
    },
    subNiche: {
      type: String,
      default: '',
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      default: 'Finance and Taxation',
      index: true,
    },
    country: {
      type: String,
      default: 'India',
    },
    city: {
      type: String,
      default: 'Pan-India',
    },
    targetAudience: {
      type: String,
      default: 'Salaried professionals, freelancers, and small business owners',
    },
    preferredLanguage: {
      type: String,
      enum: ['English', 'Hinglish', 'Hindi', 'Marathi', 'Gujarati'],
      default: 'Hinglish',
    },
    primaryPlatform: {
      type: String,
      default: 'Instagram Reels',
    },
    secondaryPlatforms: {
      type: [String],
      default: ['YouTube Shorts', 'Instagram Stories', 'Meta Ads'],
    },
    module: {
      type: String,
      enum: ['personal-branding', 'meta-ads', 'story-marketing'],
      default: 'personal-branding',
    },
    contentObjective: {
      type: String,
      default: 'Authority and Trust',
    },
    postingFrequency: {
      type: String,
      default: 'Daily',
    },
    typicalDuration: {
      type: Number,
      default: 60,
    },
    availableEquipment: {
      type: [String],
      default: ['Smartphone only (iPhone / Android HD)', 'Tripod with Ring Light', 'Wireless Lapel Mic'],
    },
    presentationPreference: {
      type: String,
      enum: [
        'On-Camera Talking Head',
        'Face + B-Roll Cutaways',
        'Voiceover + Screen/Visuals',
        'Hybrid / Dynamic Demonstration',
      ],
      default: 'On-Camera Talking Head',
    },
    brandGuidelines: {
      type: String,
      default: 'Speak like an authentic trusted friend who knows the subject deeply. Simple language, zero jargon.',
    },
    restrictedClaims: {
      type: [String],
      default: ['Never guarantee 100% tax savings', 'No unverified get-rich-quick claims'],
    },
    competitorHandles: {
      type: [String],
      default: [],
    },
    connectedAccountInsights: {
      accountHandle: { type: String, default: '' },
      followersCount: { type: Number, default: 0 },
      baselineEngagementRate: { type: String, default: '4.2%' },
      topActiveHours: { type: [String], default: ['7:00 PM - 9:00 PM', '12:30 PM - 2:00 PM'] },
      isConnected: { type: Boolean, default: false },
    },
    scheduleSettings: {
      enabled: { type: Boolean, default: true },
      runTime: { type: String, default: '08:00 AM' },
      frequency: { type: String, default: 'Daily' },
      autoGenerateBriefs: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

contentStrategySchema.index({ userId: 1, isActive: 1 });
contentStrategySchema.index({ guestId: 1, isActive: 1 });

export const ContentStrategy = mongoose.model('ContentStrategy', contentStrategySchema);
