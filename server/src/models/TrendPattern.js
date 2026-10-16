import mongoose from 'mongoose';

const trendPatternSchema = new mongoose.Schema(
  {
    patternName: {
      type: String,
      required: true,
      trim: true,
    },
    patternType: {
      type: String,
      enum: ['Hook Formula', 'Storytelling Arc', 'Educational Breakdown', 'Before/After Proof', 'Objection Handling', 'Call to Action'],
      default: 'Hook Formula',
    },
    description: {
      type: String,
      required: true,
    },
    supportingReferenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReferenceVideo',
      },
    ],
    exampleCount: {
      type: Number,
      default: 1,
    },
    relevantCategories: {
      type: [String],
      default: [],
    },
    confidence: {
      type: String,
      enum: ['High (Multi-Source Verified)', 'Moderate (Observed in 2-3 Sources)', 'Preliminary / Single Source'],
      default: 'Moderate (Observed in 2-3 Sources)',
    },
    confidenceExplanation: {
      type: String,
      default: '',
    },
    dataLimitations: {
      type: String,
      default: 'Based on accessible sample. Not claimed as an absolute universal platform rule.',
    },
    industry: {
      type: String,
      default: '',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TrendPattern = mongoose.model('TrendPattern', trendPatternSchema);
