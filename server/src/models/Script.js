import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Supports guest sessions or registered users
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Script title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
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
      index: true,
    },
    language: {
      type: String,
      default: 'English',
      index: true,
    },
    duration: {
      type: Number,
      default: 60,
    },
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    hook: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    cta: {
      type: String,
      default: '',
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
    trendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trend',
      default: null,
      index: true,
    },
    masterPromptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterPrompt',
      default: null,
      index: true,
    },
    fullContent: {
      type: String,
      default: '',
    },
    sections: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['Draft', 'Ready', 'Published', 'Archived'],
      default: 'Draft',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    variationIndex: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal querying, sorting, and user security
scriptSchema.index({ userId: 1, createdAt: -1 });
scriptSchema.index({ guestId: 1, createdAt: -1 });
scriptSchema.index({ module: 1, status: 1 });
scriptSchema.index({ title: 'text', fullContent: 'text' }, { default_language: 'none', language_override: 'none' });

export const Script = mongoose.model('Script', scriptSchema);
