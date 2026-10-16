import { z } from 'zod';

export const generateScriptSchema = z.object({
  module: z.enum(['personal-branding', 'meta-ads', 'story-marketing', 'universal']),
  category: z.string().min(1, 'Category is required'),
  objective: z.string().min(1, 'Objective is required'),
  language: z.string().default('English'),
  duration: z.number().default(60),
  methodId: z.string().optional().nullable(),
  inputData: z.record(z.any()).default({}),
  variationsCount: z.number().min(1).max(5).default(1),
});

export const regenerateSectionSchema = z.object({
  module: z.enum(['personal-branding', 'meta-ads', 'story-marketing', 'universal']),
  section: z.enum(['hook', 'body', 'cta', 'all']),
  category: z.string().optional(),
  objective: z.string().optional(),
  language: z.string().optional(),
  duration: z.number().optional(),
  inputData: z.record(z.any()).default({}),
  currentScript: z.object({
    hook: z.string().optional(),
    body: z.string().optional(),
    cta: z.string().optional(),
    sections: z.record(z.any()).optional(),
  }).default({}),
});

export const createScriptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  module: z.enum(['personal-branding', 'meta-ads', 'story-marketing', 'universal']),
  category: z.string().min(1, 'Category is required'),
  objective: z.string().min(1, 'Objective is required'),
  language: z.string().default('English'),
  duration: z.number().default(60),
  inputData: z.record(z.any()).default({}),
  hook: z.string().default(''),
  body: z.string().default(''),
  cta: z.string().default(''),
  methodId: z.string().optional().nullable(),
  methodName: z.string().optional().default(''),
  fullContent: z.string().optional().default(''),
  sections: z.record(z.any()).optional().default({}),
  status: z.enum(['Draft', 'Ready', 'Published', 'Archived']).default('Draft'),
  tags: z.array(z.string()).default([]),
});

export const updateScriptSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  module: z.enum(['personal-branding', 'meta-ads', 'story-marketing', 'universal']).optional(),
  category: z.string().optional(),
  objective: z.string().optional(),
  language: z.string().optional(),
  duration: z.number().optional(),
  inputData: z.record(z.any()).optional(),
  hook: z.string().optional(),
  body: z.string().optional(),
  cta: z.string().optional(),
  methodId: z.string().optional().nullable(),
  methodName: z.string().optional(),
  fullContent: z.string().optional(),
  sections: z.record(z.any()).optional(),
  status: z.enum(['Draft', 'Ready', 'Published', 'Archived']).optional(),
  tags: z.array(z.string()).optional(),
});
