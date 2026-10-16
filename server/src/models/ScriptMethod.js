import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    order: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    example: { type: String, default: '' },
  },
  { _id: false }
);

const scriptMethodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null means available to all users (global/template method)
    },
    name: {
      type: String,
      required: [true, 'Method name is required'],
      trim: true,
      maxlength: [100, 'Method name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Method description is required'],
      trim: true,
    },
    bestUseCase: {
      type: String,
      required: [true, 'Best use case is required'],
      trim: true,
    },
    applicableModules: {
      type: [String],
      default: ['personal-branding', 'meta-ads', 'story-marketing', 'universal'],
    },
    applicableCategories: {
      type: [String],
      default: ['All'],
    },
    steps: {
      type: [stepSchema],
      validate: {
        validator: function (steps) {
          return Array.isArray(steps) && steps.length >= 2;
        },
        message: 'A script method must have at least 2 steps',
      },
    },
    example: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    isSystemDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

scriptMethodSchema.index({ userId: 1, name: 1 });

export const ScriptMethod = mongoose.model('ScriptMethod', scriptMethodSchema);
