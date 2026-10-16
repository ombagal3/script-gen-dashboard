import { z } from 'zod';

export const researchTrendsSchema = z.object({
  title: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  brandOrCreator: z.string().optional(),
  targetAudience: z.string().optional(),
  region: z.string().default('India'),
  preferredLanguage: z.string().default('English'),
  platform: z.string().default('Cross-Platform Research'),
  period: z.string().default('Last 7 Days'),
  targetModule: z.string().default('personal-branding'),
  targetCategory: z.string().optional(),
  contentObjective: z.string().optional(),
  competitorUrls: z.array(z.string()).default([]),
  additionalInstructions: z.string().optional(),
});

export const importTrendSchema = z.object({
  name: z.string().min(1, 'Trend name is required'),
  description: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  platform: z.string().default('Cross-Platform'),
  region: z.string().default('India'),
  sourceUrl: z.string().optional(),
  observationPeriod: z.string().default('Last 7 Days'),
  searchInterestChange: z.string().optional(),
  hashtagViews: z.string().optional(),
  activeAdCount: z.string().optional(),
  lifecycle: z.enum(['Emerging', 'Growing', 'Peak', 'Declining', 'Evergreen']).default('Growing'),
  saturation: z.enum(['Low Saturation', 'Moderate Saturation', 'High Saturation', 'Unknown']).default('Moderate Saturation'),
  opportunityNotes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateTrendSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  lifecycle: z.enum(['Emerging', 'Growing', 'Peak', 'Declining', 'Evergreen']).optional(),
  saturation: z.enum(['Low Saturation', 'Moderate Saturation', 'High Saturation', 'Unknown']).optional(),
  isSaved: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});
