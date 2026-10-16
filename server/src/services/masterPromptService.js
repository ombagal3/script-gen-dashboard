import { MasterPrompt } from '../models/MasterPrompt.js';
import { Trend } from '../models/Trend.js';
import { Script } from '../models/Script.js';
import { ScriptMethod } from '../models/ScriptMethod.js';
import { aiService } from './aiService.js';
import { ApiError } from '../utils/ApiError.js';

export const masterPromptService = {
  /**
   * Generates a comprehensive, 12-section master prompt based on configuration
   */
  async generateMasterPrompt(payload, userContext = {}) {
    const {
      trendId = null,
      customTopic = '',
      researchMode = 'Use Verified Trend Research',
      industry,
      module = 'personal-branding',
      category = 'Business Owner',
      objective = 'Authority',
      targetAudience = '',
      region = 'India',
      platform = 'Instagram Reels',
      language = 'English',
      duration = 60,
      tone = 'Authoritative yet relatable',
      methodId = null,
      methodName = '',
      brandInfo = '',
      productOrServiceInfo = '',
      verifiedFacts = '',
      referenceUrls = [],
      restrictions = '',
      includeSources = true,
      title = '',
    } = payload;

    if (!industry) {
      throw new ApiError(400, 'Industry is required to generate a master prompt');
    }

    const { userId = null, guestId = null } = userContext;

    // Retrieve trend if trendId provided
    let trend = null;
    if (trendId) {
      trend = await Trend.findById(trendId).lean();
    }

    // Retrieve script method if methodId provided
    let method = null;
    if (methodId) {
      method = await ScriptMethod.findById(methodId).lean();
    }

    const activeTopic = trend?.name || customTopic || `${industry} Industry Strategy`;
    const resolvedMethodName = method?.name || methodName || 'Hook → Problem → Explanation → Solution → CTA';

    // Assemble the 12 individual sections
    const roleAndExpertise = this.buildSectionRole(industry, module, category, objective);
    const researchContext = this.buildSectionResearchContext({
      trend,
      customTopic,
      region,
      platform,
      includeSources,
      verifiedFacts,
      referenceUrls,
    });
    const trendAnalysisInstructions = this.buildSectionTrendAnalysis(activeTopic, industry);
    const audiencePsychology = this.buildSectionAudiencePsychology({
      targetAudience: targetAudience || trend?.audienceAnalysis?.targetAudience,
      industry,
      category,
      tone,
    });
    const contentStrategy = this.buildSectionContentStrategy({
      module,
      category,
      objective,
      platform,
      duration,
      resolvedMethodName,
    });
    const hookGeneration = this.buildSectionHookGeneration(activeTopic, category, module);
    const bodyGeneration = this.buildSectionBodyGeneration(activeTopic, duration, resolvedMethodName, method);
    const ctaGeneration = this.buildSectionCtaGeneration(module, objective);
    const methodIntegration = this.buildSectionMethodIntegration(resolvedMethodName, method);
    const finalDeliverables = this.buildSectionFinalDeliverables(module);
    const qualityControls = this.buildSectionQualityControls(module, duration, language);
    const outputFormat = this.buildSectionOutputFormat(language);

    // Compile full copy-ready master prompt
    const promptContent = `================================================================================
MASTER PROMPT: ${activeTopic.toUpperCase()}
MODULE: ${module.toUpperCase()} | CATEGORY: ${category} | OBJECTIVE: ${objective}
REGION: ${region} | PLATFORM: ${platform} | DURATION: ${duration}s | LANGUAGE: ${language}
================================================================================

### SECTION 1: ROLE AND EXPERTISE
${roleAndExpertise}

### SECTION 2: RESEARCH CONTEXT & VERIFIED EVIDENCE
${researchContext}

### SECTION 3: TREND ANALYSIS & STRATEGIC INSTRUCTIONS
${trendAnalysisInstructions}

### SECTION 4: AUDIENCE PSYCHOLOGY & PROFILE
${audiencePsychology}

### SECTION 5: CONTENT STRATEGY & ANGLE
${contentStrategy}

### SECTION 6: HOOK GENERATION FRAMEWORK (3 DISTINCT HOOKS)
${hookGeneration}

### SECTION 7: BODY GENERATION FRAMEWORK
${bodyGeneration}

### SECTION 8: CALL TO ACTION (CTA) FRAMEWORK
${ctaGeneration}

### SECTION 9: METHOD INTEGRATION (${resolvedMethodName})
${methodIntegration}

### SECTION 10: FINAL DELIVERABLES SPECIFICATION
${finalDeliverables}

### SECTION 11: QUALITY CONTROLS & COMPLIANCE
${qualityControls}

### SECTION 12: OUTPUT SPECIFICATIONS
${outputFormat}`;

    const promptTitle = title?.trim() || `Master Prompt: ${activeTopic} (${category})`;

    const masterPromptDoc = new MasterPrompt({
      userId,
      guestId,
      title: promptTitle,
      trendId: trend?._id || null,
      trendName: trend?.name || customTopic || '',
      researchId: trend?.researchId || null,
      researchMode,
      industry,
      module,
      category,
      objective,
      targetAudience: targetAudience || trend?.audienceAnalysis?.targetAudience || '',
      region,
      platform,
      language,
      duration,
      tone,
      methodId: method?._id || null,
      methodName: resolvedMethodName,
      brandInfo,
      productOrServiceInfo,
      verifiedFacts,
      referenceUrls,
      restrictions,
      includeSources,
      promptContent,
      sections: {
        roleAndExpertise,
        researchContext,
        trendAnalysisInstructions,
        audiencePsychology,
        contentStrategy,
        hookGeneration,
        bodyGeneration,
        ctaGeneration,
        methodIntegration,
        finalDeliverables,
        qualityControls,
        outputFormat,
      },
      version: 1,
      history: [
        {
          version: 1,
          promptContent,
          editedAt: new Date(),
        },
      ],
      isSaved: true,
      tags: [module, category.toLowerCase().replace(/\s+/g, '-'), industry.toLowerCase().replace(/\s+/g, '-')],
    });

    return await masterPromptDoc.save();
  },

  buildSectionRole(industry, module, category, objective) {
    if (module === 'personal-branding') {
      return `You are an elite Personal Branding Content Strategist and Executive Scriptwriter specializing in ${industry}. Your mandate is to establish undisputed authority, deep audience trust, and exponential organic reach for a ${category}. You never rely on sleazy marketing tricks or aggressive direct sales pitches; your methodology turns nuanced domain expertise into magnetic, accessible, high-retention content.`;
    }
    if (module === 'meta-ads') {
      return `You are a world-class Direct-Response Meta Ads Creative Strategist and Copywriter for ${industry}. You specialize in high-converting video and feed ads (Facebook & Instagram) for ${category}. You understand scroll-stopping creative mechanics, emotional pain-agitation, compliance boundaries, and compelling conversion architecture aimed at maximizing ${objective}.`;
    }
    if (module === 'story-marketing') {
      return `You are an Instagram Story Marketing Specialist and Conversational Funnel Architect for ${industry}. You craft multi-slide Story sequences for ${category} that captivate casual followers, encourage high sticker interactions (polls, sliders, questions), and smoothly drive direct messages (DMs) and qualified appointments.`;
    }
    return `You are an omnichannel Content Strategist and Master Scriptwriter specializing in ${industry}. You translate complex topics into compelling scripts with crystal-clear hooks, airtight logic, and frictionless calls to action.`;
  },

  buildSectionResearchContext({ trend, customTopic, region, platform, includeSources, verifiedFacts, referenceUrls }) {
    const lines = [];
    lines.push(`- Research Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
    lines.push(`- Target Geographic Region: ${region}`);
    lines.push(`- Primary Content Platform: ${platform}`);

    if (trend) {
      lines.push(`- Researched Market Trend: "${trend.name}"`);
      lines.push(`- Trend Lifecycle Status: ${trend.lifecycle} (Momentum: ${trend.momentumScore}/100, Opportunity: ${trend.opportunityScore}/100)`);
      lines.push(`- Primary Source: ${trend.source}`);
      if (includeSources && trend.sourceUrl) {
        lines.push(`- Verified Source URL: ${trend.sourceUrl}`);
      }
      if (trend.verifiedMetrics?.searchInterestChange) {
        lines.push(`- Verified Search Spike: ${trend.verifiedMetrics.searchInterestChange}`);
      }
      if (trend.verifiedMetrics?.hashtagViews) {
        lines.push(`- Observed Short-Form Volume: ${trend.verifiedMetrics.hashtagViews}`);
      }
      if (trend.verifiedMetrics?.activeAdCount) {
        lines.push(`- Public Ad Activity: ${trend.verifiedMetrics.activeAdCount}`);
      }
      if (trend.lifecycleEvidence) {
        lines.push(`- Supporting Lifecycle Evidence: ${trend.lifecycleEvidence}`);
      }
    } else {
      lines.push(`- Custom Subject Matter: "${customTopic}"`);
      lines.push(`- Mode: Creator Defined Custom Strategic Brief`);
    }

    if (verifiedFacts) {
      lines.push(`- Additional Verified Facts / Evidence Provided:\n  "${verifiedFacts}"`);
    }

    if (referenceUrls && referenceUrls.length > 0) {
      lines.push(`- Reference Links:\n  ${referenceUrls.map((u) => `• ${u}`).join('\n  ')}`);
    }

    lines.push(`- Factual Limitation: Do not invent unverified statistics, fake platform rankings, or manufactured claims.`);

    return lines.join('\n');
  },

  buildSectionTrendAnalysis(topic, industry) {
    return `1. Analyze why "${topic}" matters to the audience right now and pinpoint the exact confusion or costly mistake they face.
2. Filter this topic through ${industry} best practices—do NOT jump on trends blindly; extract only the legitimate, value-dense angle.
3. Identify the sharpest counter-intuitive or contrarian perspective that sets this script apart from lazy AI fluff.
4. Distinguish verified facts from speculation; do not present preliminary assumptions as indisputable truth.
5. If this trend is time-sensitive, frame the urgency around the cost of procrastination rather than artificial hype.`;
  },

  buildSectionAudiencePsychology({ targetAudience, industry, category, tone }) {
    return `- Target Audience Profile: ${targetAudience || `Professionals, consumers, or prospective clients in ${industry}`}
- Core Frustration: Overwhelmed by contradictory advice, fear of costly mistakes, or struggling with inefficient traditional methods.
- Core Motivation: Clarity, time-saving, economic efficiency, professional prestige, or personal wellbeing.
- Desired Takeaway: "This creator understands my exact problem better than anyone else, and their 3-step solution actually makes sense."
- Voice & Demeanor: ${tone || 'Authoritative yet relatable, empathetic, crisp, and completely free of jargon'}.`;
  },

  buildSectionContentStrategy({ module, category, objective, platform, duration, resolvedMethodName }) {
    return `- Module & Category: ${module} (${category})
- Primary Campaign Objective: ${objective}
- Script Format: ${platform} (${duration} seconds)
- Method Framework: ${resolvedMethodName}
- Narrative Archetype: ${module === 'meta-ads' ? 'Problem-Agitation-Solution with Direct Offer' : 'Authority-Building Educational Breakdown'}
- Differentiation: Lead with transparent reality checks and practical takeaways that competitors omit.`;
  },

  buildSectionHookGeneration(topic, category, module) {
    return `Generate 3 distinct, scroll-stopping hooks tailored for a ${category}. For each hook, specify its psychological style and why it prevents scrolling:
- Hook 1 (Curiosity Gap / Contrarian Truth): Challenge an outdated assumption regarding "${topic}".
- Hook 2 (Pain Point & Frustration): Highlight the immediate daily cost of ignoring this issue.
- Hook 3 (Relatable Anecdote / Direct Question): A punchy, conversational entry point that makes the viewer feel personally addressed.
CRITICAL: No clickbait that the script cannot deliver. Keep wording natural and spoken-language friendly.`;
  },

  buildSectionBodyGeneration(topic, duration, resolvedMethodName, method) {
    const steps = method?.steps?.map((s, idx) => `  ${idx + 1}. ${s.name}: ${s.description || 'Deliver concrete value'}`).join('\n') ||
`  1. The Core Misconception (0:05-0:20): Break down why standard advice fails.
  2. The Analytical Shift (0:20-0:40): Provide the exact mental framework or formula.
  3. Actionable Blueprint (0:40-0:55): Give 1-2 practical steps the viewer can implement today.`;

    return `Deliver an airtight, engaging script body structured for a ${duration}-second runtime:
- Flow seamlessly from the chosen hook without pausing for pleasantries.
- Method Sequence (${resolvedMethodName}):
${steps}
- Language: Conversational, rhythmically paced with natural breathing pauses.
- Visual Cue Notes: Include concise B-roll or gesture cues to sustain viewer retention.`;
  },

  buildSectionCtaGeneration(module, objective) {
    if (module === 'personal-branding') {
      return `Deliver a frictionless, organic engagement CTA aligned with ${objective}:
- Primary: "Save this post for your next project, and tap follow for weekly ${objective.toLowerCase()} strategies."
- Secondary (Alternative): "Drop your biggest challenge with this in the comments—I'll reply with a personalized tip."
- Rule: Avoid aggressive sales pitches or awkward product pushes in personal branding content.`;
    }
    if (module === 'meta-ads') {
      return `Deliver a compelling, direct-response conversion CTA aligned with ${objective}:
- Primary: "Tap the button below to get instant access / book your discovery call before slots fill up."
- State the clear next step, eliminate perceived risk, and specify the exact deliverable.`;
    }
    if (module === 'story-marketing') {
      return `Deliver an interactive Story CTA:
- "Vote in the poll below to see the results, or reply 'WORKFLOW' to get the full PDF in your DMs."`;
    }
    return `Deliver a clear, definitive call to action requesting the user save, follow, or visit the link.`;
  },

  buildSectionMethodIntegration(resolvedMethodName, method) {
    if (method && method.steps && method.steps.length > 0) {
      return `Execute the script strictly according to the saved steps of "${resolvedMethodName}":
${method.steps.map((s, i) => `Step ${i + 1}: ${s.name} → ${s.description || 'Execute clearly'}`).join('\n')}
Preserve the precise chronological flow and make each step distinctly recognizable in the script.`;
    }
    return `Follow the standard 5-phase structure: Hook → Problem Agitation → Insight/Explanation → Practical Solution → Call to Action. Ensure each phase transitions smoothly into the next.`;
  },

  buildSectionFinalDeliverables(module) {
    if (module === 'personal-branding') {
      return `Please generate the following deliverables:
1. Three Hook Variations (with style labels)
2. Complete Voiceover Script (Hook + Body + CTA, formatted with timestamps)
3. On-Screen Text Overlays (timestamped for video editors)
4. B-Roll / Visual Suggestions (5 concise scene directions)
5. Social Media Caption (optimized with high-converting opening line)
6. 6 Relevant Hashtags (niche, authority, and topic-specific)`;
    }
    if (module === 'meta-ads') {
      return `Please generate the following deliverables:
1. Three Ad Hooks (with angle explanations)
2. Primary Video Ad Script (Scene-by-scene breakdown: Visual, Voiceover, On-Screen Text)
3. Primary Ad Copy (Text above the ad in short, punchy paragraphs)
4. High-Click Headline (under 45 characters)
5. Ad Description (under 30 characters)
6. Recommended CTA Button Type (e.g., Learn More, Sign Up, Book Now)
7. 1 Alternative Variation for split-testing`;
    }
    if (module === 'story-marketing') {
      return `Please generate the following deliverables:
1. Numbered Story Slides (4 to 5 slides)
2. Text for Each Slide (concise, bite-sized copy)
3. Visual Suggestions for background/graphics
4. Interactive Sticker Placements (Poll, Slider, Question Box, Link)
5. DM Trigger Keyword & Final Conversion Slide
6. "Copy-All" clean text version`;
    }
    return `Please generate:
1. Hook Variations
2. Full Script (Hook, Body, CTA)
3. Applied Method Step Breakdown
4. On-Screen Text & Visual Cues
5. Caption and Hashtags`;
  },

  buildSectionQualityControls(module, duration, language = 'English') {
    let langRule = `- Language & Cadence: Deliver all spoken script lines, hooks, and body in natural ${language}.`;
    if (language === 'Gujarati') {
      langRule = `- Language & Cadence: Deliver all spoken script lines, hooks, body, and CTA in authentic spoken Gujarati (ગુજરાતી). Use natural creator phrasing and idioms that modern creators speak in Gujarat.`;
    } else if (language === 'Marathi') {
      langRule = `- Language & Cadence: Deliver all spoken script lines, hooks, body, and CTA in authentic spoken Marathi (मराठी) with conversational cadence.`;
    } else if (language === 'Hindi') {
      langRule = `- Language & Cadence: Deliver all spoken script lines in fluent conversational Hindi (हिंदी).`;
    } else if (language === 'Hinglish') {
      langRule = `- Language & Cadence: Deliver in modern conversational Hinglish (Hindi-English mix) as spoken by top Indian creators.`;
    }

    return `- Word Count Pacing: Target ~130-150 words per 60 seconds of spoken video.
${langRule}
- Originality: Never produce generic AI cliches ("In today's fast-paced world", "Unlock your potential").
- Authenticity: Avoid fabricated testimonials or unverified absolute guarantees.
- Platform Policy Compliance: Adhere strictly to Meta/Instagram advertising and community standards.
- Natural Tone: Use contractions and human speech cadences.`;
  },

  buildSectionOutputFormat(language = 'English') {
    return `Respond with the completed master deliverables clearly segmented using markdown headings. Ensure the primary script is completely composed in ${language} and ready for recording or teleprompter loading without additional editing needed.`;
  },

  /**
   * Generates a complete script directly from a saved Master Prompt
   * Links the created script to the Master Prompt and Trend!
   */
  async generateScriptFromMasterPrompt(masterPromptId, userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const masterPrompt = await MasterPrompt.findById(masterPromptId);

    if (!masterPrompt) {
      throw new ApiError(404, 'Master prompt not found');
    }

    // Call AI service to generate full script using prompt context
    const scriptGenerationPayload = {
      title: masterPrompt.title.replace(/^Master Prompt:\s*/i, ''),
      module: masterPrompt.module,
      category: masterPrompt.category,
      objective: masterPrompt.objective,
      language: masterPrompt.language,
      duration: masterPrompt.duration,
      methodId: masterPrompt.methodId,
      inputData: {
        topic: masterPrompt.trendName || masterPrompt.title,
        targetAudience: masterPrompt.targetAudience,
        platform: masterPrompt.platform,
        tone: masterPrompt.tone,
        additionalInstructions: `Generated from Master Prompt: ${masterPrompt.title}. Context:\n${masterPrompt.sections?.roleAndExpertise || ''}\n${masterPrompt.sections?.contentStrategy || ''}`,
        brandInfo: masterPrompt.brandInfo,
        productInfo: masterPrompt.productOrServiceInfo,
      },
    };

    const generated = await aiService.generateScript(scriptGenerationPayload);

    // Save as a new Script record in MongoDB, linked to masterPrompt and trend
    const newScript = new Script({
      userId,
      guestId,
      title: generated.title || masterPrompt.title.replace(/^Master Prompt:\s*/i, ''),
      module: masterPrompt.module,
      category: masterPrompt.category,
      objective: masterPrompt.objective,
      language: masterPrompt.language,
      duration: masterPrompt.duration,
      hook: generated.hook || '',
      body: generated.body || '',
      cta: generated.cta || '',
      methodId: masterPrompt.methodId,
      methodName: masterPrompt.methodName,
      fullContent: generated.fullContent || '',
      sections: generated.sections || {},
      status: 'Ready',
      inputData: scriptGenerationPayload.inputData,
      trendId: masterPrompt.trendId || null,
      masterPromptId: masterPrompt._id,
      tags: ['from-master-prompt', masterPrompt.module, masterPrompt.category.toLowerCase().replace(/\s+/g, '-')],
    });

    const savedScript = await newScript.save();

    // Update MasterPrompt with the generatedScriptId reference
    masterPrompt.generatedScriptId = savedScript._id;
    await masterPrompt.save();

    return {
      script: savedScript,
      masterPrompt,
    };
  },

  /**
   * Retrieves list of saved Master Prompts
   */
  async getMasterPrompts(query = {}, userContext = {}) {
    const { userId = null, guestId = null } = userContext;
    const filter = {};

    if (userId) {
      filter.$or = [{ userId }, { guestId }, { userId: null, guestId: null }];
    } else if (guestId) {
      filter.$or = [{ guestId }, { userId: null, guestId: null }];
    }

    if (query.module && query.module !== 'All') {
      filter.module = query.module;
    }

    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    if (query.industry && query.industry !== 'All') {
      filter.industry = query.industry;
    }

    if (query.search && query.search.trim()) {
      filter.$or = [
        { title: { $regex: query.search.trim(), $options: 'i' } },
        { trendName: { $regex: query.search.trim(), $options: 'i' } },
        { promptContent: { $regex: query.search.trim(), $options: 'i' } },
      ];
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const [prompts, total] = await Promise.all([
      MasterPrompt.find(filter)
        .populate('trendId', 'name lifecycle momentumScore opportunityScore source')
        .populate('generatedScriptId', 'title status createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MasterPrompt.countDocuments(filter),
    ]);

    return {
      prompts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Retrieves a single Master Prompt by ID
   */
  async getMasterPromptById(id, userContext = {}) {
    const prompt = await MasterPrompt.findById(id)
      .populate('trendId')
      .populate('generatedScriptId')
      .lean();

    if (!prompt) {
      throw new ApiError(404, 'Master prompt not found');
    }
    return prompt;
  },

  /**
   * Updates an existing Master Prompt (creates new version in history)
   */
  async updateMasterPrompt(id, updateData, userContext = {}) {
    const prompt = await MasterPrompt.findById(id);
    if (!prompt) {
      throw new ApiError(404, 'Master prompt not found');
    }

    if (updateData.promptContent && updateData.promptContent !== prompt.promptContent) {
      prompt.version = (prompt.version || 1) + 1;
      prompt.history.push({
        version: prompt.version,
        promptContent: updateData.promptContent,
        editedAt: new Date(),
      });
      prompt.promptContent = updateData.promptContent;
    }

    if (updateData.title) prompt.title = updateData.title;
    if (updateData.sections) prompt.sections = { ...prompt.sections, ...updateData.sections };
    if (updateData.tags) prompt.tags = updateData.tags;
    if (typeof updateData.isSaved === 'boolean') prompt.isSaved = updateData.isSaved;

    return await prompt.save();
  },

  /**
   * Duplicates a Master Prompt
   */
  async duplicateMasterPrompt(id, userContext = {}) {
    const source = await MasterPrompt.findById(id).lean();
    if (!source) {
      throw new ApiError(404, 'Master prompt not found');
    }

    const { _id, createdAt, updatedAt, ...cloneData } = source;
    cloneData.title = `${source.title} (Copy)`;
    cloneData.version = 1;
    cloneData.generatedScriptId = null;
    cloneData.history = [{ version: 1, promptContent: source.promptContent, editedAt: new Date() }];

    const newDoc = new MasterPrompt(cloneData);
    return await newDoc.save();
  },

  /**
   * Deletes a Master Prompt
   */
  async deleteMasterPrompt(id, userContext = {}) {
    const prompt = await MasterPrompt.findById(id);
    if (!prompt) {
      throw new ApiError(404, 'Master prompt not found');
    }

    await MasterPrompt.findByIdAndDelete(id);
    return { success: true, message: 'Master prompt deleted successfully' };
  },
};
