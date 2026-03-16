import { defineCollection, z } from 'astro:content';

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

const cookbook = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    preparationTime: z.string().optional(),
    cookTime: z.string().optional(),
    cookTemperature: z.union([z.string(), z.number()]).transform(String).optional(),
    totalTime: z.string().optional(),
    dairyFree: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    soyFree: z.boolean().optional(),
    refinedSugarFree: z.boolean().optional(),
    vegetarian: z.boolean().optional(),
    vegan: z.boolean().optional(),
    lowCarb: z.boolean().optional(),
    highFat: z.boolean().optional(),
  }),
});

export const collections = { thoughts, cookbook };
