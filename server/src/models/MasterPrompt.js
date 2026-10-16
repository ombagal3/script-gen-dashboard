import mongoose from 'mongoose';

const masterPromptSchema = new mongoose.Schema(
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
      required: [true, 'Master prompt title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    trendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trend',
      default: null,
      index: true,
    },
    trendName: {
      type: String,
      default: '',
    },
    researchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrendResearch',
      default: null,
      index: true,
    },
    researchMode: {
      type: String,
      enum: ['Use Verified Trend Research', 'Use My Custom Topic', 'Combine Research and Custom Topic'],
      default: 'Use Verified Trend Research',
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      index: true,
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      enum: ['personal-branding', 'meta-ads', 'story-marketing', 'universal'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    objective: {
      type: String,
      required: [true, 'Objective is required'],
    },
    targetAudience: {
      type: String,
      default: '',
    },
    region: {
      type: String,
      default: 'India',
    },
    platform: {
      type: String,
      default: 'Instagram Reels',
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: Number,
      default: 60,
    },
    tone: {
      type: String,
      default: 'Authoritative yet relatable',
    },
    methodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScriptMethod',
      default: null,
    },
    methodName: {
      type: String,
      default: '',
    },
    brandInfo: {
      type: String,
      default: '',
    },
    productOrServiceInfo: {
      type: String,
      default: '',
    },
    verifiedFacts: {
      type: String,
      default: '',
    },
    referenceUrls: {
      type: [String],
      default: [],
    },
    restrictions: {
      type: String,
      default: '',
    },
    includeSources: {
      type: Boolean,
      default: true,
    },
    promptContent: {
      type: String,
      required: [true, 'Prompt content is required'],
    },
    sections: {
      roleAndExpertise: { type: String, default: '' },
      researchContext: { type: String, default: '' },
      trendAnalysisInstructions: { type: String, default: '' },
      audiencePsychology: { type: String, default: '' },
      contentStrategy: { type: String, default: '' },
      hookGeneration: { type: String, default: '' },
      bodyGeneration: { type: String, default: '' },
      ctaGeneration: { type: String, default: '' },
      methodIntegration: { type: String, default: '' },
      finalDeliverables: { type: String, default: '' },
      qualityControls: { type: String, default: '' },
      outputFormat: { type: String, default: '' },
    },
    version: {
      type: Number,
      default: 1,
    },
    history: [
      {
        version: { type: Number, required: true },
        promptContent: { type: String, required: true },
        editedAt: { type: Date, default: Date.now },
      },
    ],
    generatedScriptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Script',
      default: null,
    },
    isSaved: {
      type: Boolean,
      default: true,
      index: true,
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

masterPromptSchema.index({ userId: 1, createdAt: -1 });
masterPromptSchema.index({ guestId: 1, createdAt: -1 });
masterPromptSchema.index({ module: 1, category: 1 });
masterPromptSchema.index({ title: 'text', promptContent: 'text' }, { default_language: 'none', language_override: 'none' });

export const MasterPrompt = mongoose.model('MasterPrompt', masterPromptSchema);
