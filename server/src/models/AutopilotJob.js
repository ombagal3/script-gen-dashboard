import mongoose from 'mongoose';

const autopilotJobSchema = new mongoose.Schema(
  {
    strategyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentStrategy',
      required: true,
      index: true,
    },
    brandName: {
      type: String,
      default: '',
    },
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
    jobType: {
      type: String,
      enum: ['Scheduled Daily', 'Manual On-Demand', 'Strategy Re-Scan'],
      default: 'Manual On-Demand',
    },
    status: {
      type: String,
      enum: ['Queued', 'In Progress', 'Completed', 'Partial', 'Failed'],
      default: 'In Progress',
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    briefsGeneratedCount: {
      type: Number,
      default: 0,
    },
    briefIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AutopilotBrief',
      },
    ],
    sourcesPolled: [
      {
        name: String,
        status: String,
        trendsExtracted: Number,
        latencyMs: Number,
      },
    ],
    logs: {
      type: [String],
      default: [],
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

autopilotJobSchema.index({ strategyId: 1, createdAt: -1 });

export const AutopilotJob = mongoose.model('AutopilotJob', autopilotJobSchema);
