import { ScriptMethod } from '../models/ScriptMethod.js';
import { ApiError } from '../utils/ApiError.js';

export const DEFAULT_METHODS = [
  {
    name: 'Method 1: Hook → Problem → Explanation → Solution → CTA',
    description: 'The universal 5-step retention and conversion formula for short-form video and high-impact social scripts.',
    bestUseCase: 'Educational videos, professional advice, and product breakdown reels.',
    applicableModules: ['personal-branding', 'meta-ads', 'story-marketing', 'universal'],
    applicableCategories: ['All'],
    steps: [
      { order: 1, name: 'Hook', description: 'Immediate pattern interrupt, curiosity, or bold claim (0-3s)', example: 'Most business owners make this costly tax mistake...' },
      { order: 2, name: 'Problem', description: 'Agitate the specific pain point the audience experiences', example: 'They overpay by $5,000 every year because of outdated filings.' },
      { order: 3, name: 'Explanation', description: 'Break down why this happens and reveal the hidden catch', example: 'Section 179 allows you to deduct capital assets immediately.' },
      { order: 4, name: 'Solution', description: 'Actionable step-by-step guidance or product recommendation', example: 'Audit your Q3 invoices today using this 3-point checklist.' },
      { order: 5, name: 'CTA', description: 'Clear, singular call to action for the audience', example: 'Save this post so you have it ready before tax season!' },
    ],
    example: 'A 60-second Instagram Reel or TikTok explaining a tax deduction with a checklist.',
    notes: 'Keep each step strictly under 15 seconds to maintain high viewer retention.',
    isSystemDefault: true,
  },
  {
    name: 'Method 2: PAS (Problem → Agitate → Solution → CTA)',
    description: 'Classic copywriting framework optimized for high-converting ads and sales reels.',
    bestUseCase: 'Direct-response Meta ads, founder-led stories, and promotional sequences.',
    applicableModules: ['meta-ads', 'personal-branding', 'universal'],
    applicableCategories: ['Direct Sales', 'Founder-Based Brand', 'Business Owner'],
    steps: [
      { order: 1, name: 'Hook & Problem', description: 'State the burning problem directly in the first 3 seconds', example: 'Still spending 4 hours a day on manual data entry?' },
      { order: 2, name: 'Agitate', description: 'Make the consequence of not solving it vivid and pressing', example: 'While your competitors automate, you are burning mental energy and losing deals.' },
      { order: 3, name: 'Solution', description: 'Introduce your product/service as the obvious breakthrough', example: 'Our tool syncs all your leads in real-time in under 60 seconds.' },
      { order: 4, name: 'Offer & CTA', description: 'Irresistible time-limited offer with direct conversion link', example: 'Tap Shop Now to get 50% off your first month.' },
    ],
    example: 'Meta Feed or Reels ad driving traffic to a landing page.',
    notes: 'Agitation should trigger emotional urgency without sounding exaggerated.',
    isSystemDefault: true,
  },
  {
    name: 'Method 3: Before → After → Bridge (BAB)',
    description: 'Transformation-centered framework highlighting the contrast between the struggle and the dream outcome.',
    bestUseCase: 'Testimonial reels, case studies, fitness/wellness, coaching, and transformation stories.',
    applicableModules: ['personal-branding', 'meta-ads', 'story-marketing', 'universal'],
    applicableCategories: ['Before / After', 'Doctor', 'Personal Story', 'Testimonials'],
    steps: [
      { order: 1, name: 'Before (The Pain)', description: 'Describe where the user/client was previously', example: '6 months ago, I was completely overwhelmed with 70-hour workweeks.' },
      { order: 2, name: 'After (The Dream State)', description: 'Paint the vivid picture of the current successful state', example: 'Today, the business runs smoothly with predictable 3x revenue.' },
      { order: 3, name: 'The Bridge', description: 'Explain the bridge or mechanism that caused the change', example: 'The single shift was implementing this automated lead pipeline.' },
      { order: 4, name: 'CTA', description: 'Invite the viewer to cross the bridge with you', example: 'Comment "BRIDGE" below and I will send you the exact template.' },
    ],
    example: 'Case study carousel or video showing client transformation.',
    notes: 'The sharper the contrast between Before and After, the higher the conversion.',
    isSystemDefault: true,
  },
  {
    name: 'Method 4: Story → Lesson → Offer',
    description: 'Narrative-driven approach that builds immense emotional trust before presenting an offer.',
    bestUseCase: 'Story marketing, personal brand reels, and founder origin stories.',
    applicableModules: ['story-marketing', 'personal-branding', 'meta-ads', 'universal'],
    applicableCategories: ['Story', 'Personal Story', 'Education'],
    steps: [
      { order: 1, name: 'Hook & Story Open', description: 'Draw the viewer into a personal, vulnerable story moment', example: 'In 2021, I made a $20,000 mistake that almost shut down my agency.' },
      { order: 2, name: 'The Climax & Turning Point', description: 'Share what happened at the peak of the challenge', example: 'We lost our biggest client overnight because of a single miscommunication.' },
      { order: 3, name: 'The Universal Lesson', description: 'Extract the golden rule that applies to the viewer', example: 'Contracts and automated follow-ups protect relationships, not just money.' },
      { order: 4, name: 'CTA / Next Step', description: 'Offer a related resource or invite genuine discussion', example: 'Share your thoughts: Have you ever had a client disaster you learned from?' },
    ],
    example: 'Story sequence or LinkedIn / Instagram video sharing a real founder setback.',
    notes: 'Vulnerability breeds connection. Do not sanitize the story to look flawless.',
    isSystemDefault: true,
  },
  {
    name: 'Method 5: Myth Buster',
    description: 'High-virality structure that destroys common misconceptions and replaces them with truth.',
    bestUseCase: 'Authority building, informative reels, doctor / CA / consultant explainers.',
    applicableModules: ['personal-branding', 'universal'],
    applicableCategories: ['Doctor', 'CA', 'Informative', 'Education'],
    steps: [
      { order: 1, name: 'Bold Myth Hook', description: 'Quote the myth that everyone mistakenly believes', example: 'Stop drinking 5 liters of water every day thinking it detoxes your kidneys.' },
      { order: 2, name: 'Why It Is Flawed', description: 'Scientifically or logically dismantle the myth', example: 'Overhydration can lead to hyponatremia and electrolyte imbalance.' },
      { order: 3, name: 'The Real Truth', description: 'Provide the verified accurate metric or guideline', example: 'Your body actually needs 2.5 to 3 liters with adequate minerals.' },
      { order: 4, name: 'CTA', description: 'Urge the audience to share with friends who believe the myth', example: 'Send this to a friend who carries a gallon bottle everywhere!' },
    ],
    example: 'Viral health or financial misconception reel.',
    notes: 'Cite credible logic to reinforce authoritative positioning.',
    isSystemDefault: true,
  },
];

let inMemoryMethods = [...DEFAULT_METHODS];

export const methodService = {
  async seedDefaults() {
    try {
      const count = await ScriptMethod.countDocuments({ isSystemDefault: true });
      if (count === 0) {
        console.log('[MethodService] Seeding default script methods into MongoDB...');
        await ScriptMethod.insertMany(DEFAULT_METHODS);
        console.log('[MethodService] Default script methods seeded successfully.');
      }
    } catch (err) {
      console.warn('[MethodService] Seeding fallback (DB unavailable or read-only):', err.message);
    }
  },

  async getMethods(userId = null) {
    try {
      const query = userId
        ? { $or: [{ userId }, { isSystemDefault: true }, { userId: null }] }
        : { $or: [{ isSystemDefault: true }, { userId: null }] };

      const methods = await ScriptMethod.find(query).sort({ isSystemDefault: -1, createdAt: -1 });
      if (methods.length > 0) return methods;
    } catch (err) {
      console.warn('[MethodService] DB query failed, returning in-memory methods:', err.message);
    }
    return inMemoryMethods;
  },

  async getMethodById(id, userId = null) {
    try {
      const method = await ScriptMethod.findById(id);
      if (method) return method;
    } catch {
      // Check in-memory
    }
    const mem = inMemoryMethods.find((m) => m._id?.toString() === id || m.id === id);
    if (!mem) throw new ApiError(404, 'Script method not found');
    return mem;
  },

  async createMethod(data, userId = null) {
    try {
      const newMethod = await ScriptMethod.create({
        ...data,
        userId,
        isSystemDefault: false,
      });
      return newMethod;
    } catch (err) {
      console.warn('[MethodService] DB create failed, saving to in-memory store:', err.message);
      const newMem = {
        _id: `mem_method_${Date.now()}`,
        ...data,
        userId,
        isSystemDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryMethods.unshift(newMem);
      return newMem;
    }
  },

  async updateMethod(id, data, userId = null) {
    try {
      const method = await ScriptMethod.findById(id);
      if (method) {
        if (method.isSystemDefault && !userId) {
          throw new ApiError(403, 'System default methods cannot be overwritten directly. You can clone or create a new custom method.');
        }
        Object.assign(method, data);
        await method.save();
        return method;
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }

    const idx = inMemoryMethods.findIndex((m) => m._id?.toString() === id || m.id === id);
    if (idx !== -1) {
      inMemoryMethods[idx] = { ...inMemoryMethods[idx], ...data, updatedAt: new Date() };
      return inMemoryMethods[idx];
    }

    throw new ApiError(404, 'Script method not found');
  },

  async deleteMethod(id, userId = null) {
    try {
      const method = await ScriptMethod.findById(id);
      if (method) {
        if (method.isSystemDefault) {
          throw new ApiError(403, 'System default methods cannot be deleted.');
        }
        await method.deleteOne();
        return { message: 'Method deleted successfully' };
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
    }

    const idx = inMemoryMethods.findIndex((m) => m._id?.toString() === id || m.id === id);
    if (idx !== -1) {
      if (inMemoryMethods[idx].isSystemDefault) {
        throw new ApiError(403, 'System default methods cannot be deleted.');
      }
      inMemoryMethods.splice(idx, 1);
      return { message: 'Method deleted successfully' };
    }

    throw new ApiError(404, 'Script method not found');
  },
};
