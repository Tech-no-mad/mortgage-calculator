import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    canonicalUrl: z.string(),
    state: z.string().optional(),
    county: z.string().optional(),
    loanType: z.string().optional(),
    relatedCalculator: z.string().optional(),
  })
});

export const collections = {
  'blog': blogCollection,
};
