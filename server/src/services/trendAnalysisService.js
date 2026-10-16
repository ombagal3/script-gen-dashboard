/**
 * Trend Analysis Service
 * Evaluates discovered trends against ALL existing script modules and categories:
 * - Personal Branding (CA, Doctor, Business Owner, Education, Informative, Personal Story)
 * - Meta Ads (Founder-Based Brand, Story, Before / After, Q&A, Direct Sales, Testimonials, How-To, Educational, Informative, Storytelling)
 * - Story Marketing (Story Default, Other, CTA)
 * - Script Definition frameworks & methods
 */

export const trendAnalysisService = {
  /**
   * Deeply analyzes a trend across modules, audience psychology, and content angles.
   */
  analyzeTrend(trend) {
    const { name, industry, platform, source, description, region = 'India' } = trend;

    // 1. Audience Analysis
    const audienceAnalysis = this.generateAudienceAnalysis(trend);

    // 2. Content Opportunity Analysis
    const contentOpportunity = this.generateContentOpportunity(trend);

    // 3. Category & Module Relevance Evaluation
    const personalBrandingAnalysis = this.evaluatePersonalBranding(trend);
    const metaAdsAnalysis = this.evaluateMetaAds(trend);
    const storyMarketingAnalysis = this.evaluateStoryMarketing(trend);
    const scriptDefinitionAnalysis = this.evaluateScriptDefinition(trend);

    // Determine aggregate relevant modules & categories
    const relevantModules = [];
    const relevantCategories = [];

    if (personalBrandingAnalysis.isRecommended) {
      relevantModules.push('personal-branding');
      relevantCategories.push(...personalBrandingAnalysis.recommendedCategories);
    }
    if (metaAdsAnalysis.isRecommended) {
      relevantModules.push('meta-ads');
      relevantCategories.push(...metaAdsAnalysis.recommendedCategories);
    }
    if (storyMarketingAnalysis.isRecommended) {
      relevantModules.push('story-marketing');
      relevantCategories.push(...storyMarketingAnalysis.recommendedCategories);
    }
    relevantModules.push('universal');

    return {
      audienceAnalysis,
      contentOpportunity,
      crossModuleMapping: {
        personalBranding: personalBrandingAnalysis,
        metaAds: metaAdsAnalysis,
        storyMarketing: storyMarketingAnalysis,
        scriptDefinition: scriptDefinitionAnalysis,
      },
      relevantModules: Array.from(new Set(relevantModules)),
      relevantCategories: Array.from(new Set(relevantCategories)),
    };
  },

  generateAudienceAnalysis(trend) {
    const { name, industry } = trend;
    return {
      targetAudience: `Professionals, consumers, and decision-makers engaged in or affected by ${industry}.`,
      audienceProblem: `Confusion, lack of clarity, or inefficient old habits regarding '${name}'.`,
      searchIntent: `Seeking step-by-step guidance, actionable clarity, and unbiased expert perspective.`,
      commonQuestions: [
        `What is the real truth behind '${name}'?`,
        `How does this directly affect my time, money, or health?`,
        `What mistake should I avoid making right now?`,
        `What is the easiest step-by-step fix?`,
      ],
      emotionalMotivation: `Desire for security, confidence, and competitive advantage without falling for hype.`,
      contentRelevance: `Directly impacts immediate daily choices and operational decisions in ${industry}.`,
    };
  },

  generateContentOpportunity(trend) {
    const { name, industry } = trend;
    return {
      whyItMatters: `'${name}' addresses an immediate friction point that current surface-level content fails to resolve with authentic depth.`,
      whyNow: `Search momentum and social conversations are peaking right now; establishing your perspective today locks in authoritative search presence.`,
      missingFromExistingContent: `Most competitors post generic summaries or promotional pitches; they lack practical frameworks, transparent numbers, or empathetic nuance.`,
      originalAngles: [
        `Contrarian Breakdown: Why the mainstream advice around '${name}' is flawed`,
        `The Step-by-Step Blueprint: How practitioners actually navigate this`,
        `Case Study: The real cost of ignoring this shift for 6 months`,
      ],
      suitableFormats: [
        'Direct-to-camera educational Reel (60s)',
        'Multi-slide Story breakdown with decision poll',
        'Structured Meta Ad highlighting the pain of delay',
      ],
      potentialRisks: [
        'Avoid making unsubstantiated guarantees or medical/financial promises',
        'Keep terminology accessible for non-technical viewers',
      ],
      recommendedAction: 'Create Now',
    };
  },

  /**
   * Personal Branding Analysis:
   * Evaluates CA, Doctor, Business Owner, Education, Informative, Personal Story.
   * Focus: reach, authority, follower growth, trust (no aggressive direct selling).
   */
  evaluatePersonalBranding(trend) {
    const { name, industry } = trend;
    const lowerInd = (industry || '').toLowerCase();

    let recommendedCategories = ['Informative', 'Education'];

    if (lowerInd.includes('finance') || lowerInd.includes('tax') || lowerInd.includes('account')) {
      recommendedCategories = ['CA', 'Business Owner', 'Informative'];
    } else if (lowerInd.includes('health') || lowerInd.includes('medic') || lowerInd.includes('fit')) {
      recommendedCategories = ['Doctor', 'Education', 'Personal Story'];
    } else if (lowerInd.includes('business') || lowerInd.includes('tech') || lowerInd.includes('e-com')) {
      recommendedCategories = ['Business Owner', 'Informative', 'Personal Story'];
    } else {
      recommendedCategories = ['Education', 'Informative', 'Personal Story'];
    }

    return {
      isRecommended: true,
      recommendedCategories,
      angle: `Demystify '${name}' from a trusted professional standpoint, focusing on transparency and long-term authority rather than direct sales.`,
      hookIdea: `If you are navigating ${industry}, this 1 shift around '${name}' will save you months of trial and error.`,
      ctaStyle: `Save this post for reference and follow for actionable weekly breakdowns.`,
      primaryBenefit: 'Builds unshakeable authority and follower loyalty by delivering high signal-to-noise education.',
    };
  },

  /**
   * Meta Ads Analysis:
   * Evaluates Founder-Based Brand, Story, Before / After, Q&A, Direct Sales, Testimonials, How-To, Educational, Informative, Storytelling.
   */
  evaluateMetaAds(trend) {
    const { name, industry } = trend;

    return {
      isRecommended: true,
      recommendedCategories: ['Founder-Based Brand', 'Story', 'Before / After', 'Q&A'],
      angle: `Position your solution as the transparent answer to the friction created by '${name}'. Highlight before/after transformation without false promises.`,
      creativeFormat: 'Lo-Fi UGC / Founder Direct-to-Camera Video with dynamic captions and problem agitation in first 3 seconds.',
      complianceNote: 'Ensure all comparative claims are backed by documented process and avoid prohibited absolute guarantees.',
      suggestedCta: 'Learn More / Book a Consultation',
    };
  },

  /**
   * Story Marketing Analysis:
   * Evaluates Story Default, Other, CTA.
   */
  evaluateStoryMarketing(trend) {
    const { name } = trend;

    return {
      isRecommended: true,
      recommendedCategories: ['Story Default', 'CTA'],
      sequenceIdea: `Slide 1: Curiosity hook ('Have you noticed this happening with ${name}?') → Slide 2: Interactive Poll (Yes/No) → Slide 3: 2-point insight → Slide 4: DM CTA ('Reply INFO for the full template').`,
      suggestedSlideCount: 4,
      stickerStrategy: 'Poll sticker on Slide 2 to warm up engagement; Question Box or Link sticker on Slide 4 for conversion.',
    };
  },

  /**
   * Script Definition Analysis:
   * Evaluates Hook, Body, CTA, and recommends specific writing methods.
   */
  evaluateScriptDefinition(trend) {
    const { name } = trend;

    return {
      recommendedMethodName: 'Hook → Problem → Explanation → Solution → CTA',
      hookStyle: 'Curiosity Gap / Contrarian Truth',
      bodyStructure: `1. The Misconception: What most people think about '${name}'. 2. The Truth: What data/experience shows. 3. The 3-Step Execution Blueprint.`,
      ctaType: 'Save & Comment',
      methodSteps: [
        'Hook: Stop scrollers with an unexpected observation',
        'Problem: Agitate the real cost of inaction',
        'Explanation: Break down the root cause in simple terms',
        'Solution: Give 1 concrete action to take today',
        'CTA: Prompt bookmarking and meaningful conversation',
      ],
    };
  },
};
