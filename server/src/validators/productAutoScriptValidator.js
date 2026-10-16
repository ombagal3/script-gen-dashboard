import { z } from 'zod';

export const generateProductAutoScriptSchema = z.object({
  productName: z.string().min(1, 'Product Name is required'),
  autoScriptEnabled: z.boolean().default(true),
  module: z.enum(['personal-branding', 'meta-ads', 'story-marketing']).default('personal-branding'),
  platform: z.string().default('Instagram Reels'),
  targetMarket: z.string().default('India'),
  language: z.enum(['English', 'Hinglish', 'Hindi', 'Marathi', 'Gujarati']).default('English'),
  productUrl: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  price: z.string().optional().or(z.literal('')),
  benefits: z.string().optional().or(z.literal('')),
  painPoints: z.string().optional().or(z.literal('')),
  dateRange: z.string().default('Last 7 Days'),
});

export const regenerateHookSchema = z.object({
  autoScriptId: z.string().min(1, 'AutoScript ID is required'),
});

export const alternativeAngleSchema = z.object({
  autoScriptId: z.string().min(1, 'AutoScript ID is required'),
});
