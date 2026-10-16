import mongoose from 'mongoose';

const hookOptionSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    style: { type: String, required: true }, // e.g. 'Contrarian Truth', 'Pain Agitation', 'Relatable Story'
    hookText: { type: String, required: true },
    rationale: { type: String, default: '' },
    isRecommended: { type: Boolean, default: false },
  },
  { _id: false }
);

const sceneSchema = new mongoose.Schema(
  {
    sceneNumber: { type: Number, required: true },
    timeRange: { type: String, default: '0:00 - 0:10' },
    dialogue: { type: String, required: true },
    cameraFraming: { type: String, default: 'Medium Close-Up (Eye Level)' },
    location: { type: String, default: 'Neutral Desk / Office Setup' },
    props: { type: String, default: 'None required' },
    gestures: { type: String, default: 'Direct relaxed eye contact' },
    bRollCue: { type: String, default: '' },
    onScreenText: { type: String, default: '' },
    shotDurationSeconds: { type: Number, default: 8 },
  },
  { _id: false }
);

const autopilotBriefSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    priorityRank: {
      type: String,
      enum: ['Best Opportunity', 'Alternative Opportunity', 'Evergreen Backup'],
      default: 'Best Opportunity',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Brief title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: true,
    },
    opportunityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
      index: true,
    },
    opportunityScoreBreakdown: {
      recency: { type: Number, default: 20 },
      relevance: { type: Number, default: 20 },
      momentum: { type: Number, default: 20 },
      contentGap: { type: Number, default: 15 },
      productionEffort: { type: Number, default: 10 },
      originality: { type: Number, default: 15 },
    },
    module: {
      type: String,
      enum: ['personal-branding', 'meta-ads', 'story-marketing'],
      default: 'personal-branding',
      index: true,
    },
    category: {
      type: String,
      default: 'Business Owner',
    },
    language: {
      type: String,
      default: 'Hinglish',
    },
    targetDuration: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: [
        'Researching',
        'Research Complete',
        'Script Ready',
        'Ready to Shoot',
        'Shooting',
        'Editing',
        'Ready to Upload',
        'Published',
        'Performance Review',
      ],
      default: 'Ready to Shoot',
      index: true,
    },

    // A. Research Evidence
    researchEvidence: {
      topic: { type: String, default: '' },
      researchDate: { type: Date, default: Date.now },
      trendStatus: { type: String, default: 'Growing' },
      sourceLinks: [
        {
          title: String,
          url: String,
          source: String,
          publishedAt: Date,
          snippet: String,
        },
      ],
      verifiedMetrics: {
        searchInterestChange: { type: String, default: '' },
        hashtagViews: { type: String, default: '' },
        activeAdCount: { type: String, default: '' },
        recentArticlesCount: { type: Number, default: 0 },
      },
      selectionReason: { type: String, default: '' },
      analyzedExamplesCount: { type: Number, default: 6 },
      recurringPatterns: { type: [String], default: [] },
      differentiatingAngle: { type: String, default: '' },
      confidence: {
        type: String,
        enum: ['High', 'Moderate', 'Preliminary / Inferred'],
        default: 'High',
      },
      limitations: { type: String, default: '' },
    },

    // B. Complete Script
    script: {
      hookOptions: { type: [hookOptionSchema], default: [] },
      recommendedHook: { type: String, default: '' },
      body: { type: String, default: '' },
      cta: { type: String, default: '' },
      fullScript: { type: String, default: '' },
      tone: { type: String, default: 'Authoritative yet relatable' },
    },

    // C. Shooting Instructions
    shootingInstructions: {
      scenes: { type: [sceneSchema], default: [] },
      equipmentRequired: { type: String, default: 'Smartphone with wide camera + tripod' },
      lightingAdvice: { type: String, default: 'Position facing window or 45-degree softbox/ring light' },
      audioAdvice: { type: String, default: 'Keep microphone 6 inches from chest; quiet room' },
      totalEstimatedShootingMinutes: { type: Number, default: 15 },
    },

    // D. Editing Instructions
    editingInstructions: {
      cutsAndPacing: { type: String, default: 'Tight sentence cuts, cut out breath pauses, 1.5s visual pace' },
      subtitleStyle: { type: String, default: 'Centered 2-word captions, bold sans-serif with yellow active highlight' },
      visualEmphasis: { type: String, default: '1.1x punch zoom on key contrasting sentences' },
      transitionNotes: { type: String, default: 'Clean whip pan or gentle whoosh on section transitions' },
      musicAudioNotes: { type: String, default: 'Low volume upbeat lo-fi instrumental (ducked during dialogue)' },
      coverThumbnailText: { type: String, default: '' },
      aspectRatio: { type: String, default: '9:16 Vertical (1080x1920)' },
    },

    // E. Upload Package
    uploadPackage: {
      caption: { type: String, default: '' },
      hashtags: { type: [String], default: [] },
      coverTitle: { type: String, default: '' },
      cta: { type: String, default: '' },
      platformNotes: { type: String, default: 'Upload as Reel, add relevant audio, disable auto-sharing to feed if testing' },
      suggestedPublishingTime: { type: String, default: 'Between 7:00 PM and 9:00 PM IST (Peak engagement window)' },
      isPersonalizedTiming: { type: Boolean, default: false },
    },

    // Performance Feedback (When logged by user)
    performanceFeedback: {
      views: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      watchTimeAvg: { type: String, default: '' },
      saves: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      follows: { type: Number, default: 0 },
      feedbackNotes: { type: String, default: '' },
      performanceVsBaseline: { type: String, default: 'Not logged yet' },
      loggedAt: { type: Date, default: null },
    },

    scriptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Script',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

autopilotBriefSchema.index({ strategyId: 1, date: -1 });
autopilotBriefSchema.index({ userId: 1, status: 1 });
autopilotBriefSchema.index({ guestId: 1, status: 1 });
autopilotBriefSchema.index({ priorityRank: 1, status: 1 });

export const AutopilotBrief = mongoose.model('AutopilotBrief', autopilotBriefSchema);
