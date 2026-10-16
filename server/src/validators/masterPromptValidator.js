import { z } from 'zod';

export const generateMasterPromptSchema = z.object({
  title: z.string().optional(),
  trendId: z.string().optional().nullable(),
  customTopic: z.string().optional(),
  researchMode: z
    .enum(['Use Verified Trend Research', 'Use My Custom Topic', 'Combine Research and Custom Topic'])
    .default('Use Verified Trend Research'),
  industry: z.string().min(1, 'Industry is required'),
  module: z.enum(['personal-branding', 'meta-ads', 'story-marketing', 'universal']).default('personal-branding'),
  category: z.string().min(1, 'Category is required'),
  objective: z.string().min(1, 'Objective is required'),
  targetAudience: z.string().optional(),
  region: z.string().default('India'),
  platform: z.string().default('Instagram Reels'),
  language: z.string().default('English'),
  duration: z.number().default(60),
  tone: z.string().default('Authoritative yet relatable'),
  methodId: z.string().optional().nullable(),
  methodName: z.string().optional(),
  brandInfo: z.string().optional(),
  productOrServiceInfo: z.string().optional(),
  verifiedFacts: z.string().optional(),
  referenceUrls: z.array(z.string()).default([]),
  restrictions: z.string().optional(),
  includeSources: z.boolean().default(true),
});

export const updateMasterPromptSchema = z.object({
  title: z.string().optional(),
  promptContent: z.string().optional(),
  sections: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  isSaved: z.boolean().optional(),
});
