// Content collections — Astro 5 schema definition.
// Each Markdown file in src/content/work/ and src/content/essays/ must have
// frontmatter that matches these schemas. Astro will fail the build if not.
//
// To add a new case study: drop a `.md` file into src/content/work/ with the
// frontmatter shape below. Same for essays.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),                          // small label, e.g. "Banking modernization · 2024 → present"
    role: z.string(),                            // your role on the project
    client: z.string().optional(),               // who it was for
    period: z.string(),                          // "2024 — present"
    summary: z.string(),                         // one-sentence description for cards
    excerpt: z.string(),                         // ~2 sentences for the homepage feature card
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),                // path under /public/images/
    order: z.number().default(100),              // lower = listed first
    featured: z.boolean().default(false),        // featured on homepage feature card
    draft: z.boolean().default(false)
  })
});

const essays = defineCollection({
  loader: glob({ base: './src/content/essays', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),          // "8 min read"
    draft: z.boolean().default(false)
  })
});

export const collections = { work, essays };
