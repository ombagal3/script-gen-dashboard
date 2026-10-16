import { z } from 'zod';

const stepValidator = z.object({
  id: z.string().optional(),
  order: z.number(),
  name: z.string().min(1, 'Step name is required'),
  description: z.string().optional().default(''),
  example: z.string().optional().default(''),
});

export const createMethodSchema = z.object({
  name: z.string().min(1, 'Method name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  bestUseCase: z.string().min(1, 'Best use case is required'),
  applicableModules: z.array(z.string()).default(['personal-branding', 'meta-ads', 'story-marketing', 'universal']),
  applicableCategories: z.array(z.string()).default(['All']),
  steps: z.array(stepValidator).min(2, 'At least 2 steps are required'),
  example: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export const updateMethodSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  bestUseCase: z.string().optional(),
  applicableModules: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  steps: z.array(stepValidator).min(2).optional(),
  example: z.string().optional(),
  notes: z.string().optional(),
});
