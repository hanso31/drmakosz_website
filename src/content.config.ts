import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const imageFields = {
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
};

const leistungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leistungen' }),
  schema: z.object({
    lang: z.enum(['de', 'en', 'fr']),
    title: z.string(),
    category: z.enum(['erkrankungen', 'schoenheit']),
    description: z.string(),
    order: z.number().default(99),
    ...imageFields,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    lang: z.enum(['de', 'en', 'fr']),
    pageId: z.enum(['home', 'ueber-uns', 'kontakt', 'erkrankungen', 'schoenheit', 'impressum', 'datenschutz', 'bildquellen']),
    title: z.string(),
    description: z.string(),
    ...imageFields,
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    lang: z.enum(['de', 'en', 'fr']),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    published: z.boolean().default(false),
    ...imageFields,
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/settings' }),
  schema: z.object({
    lang: z.enum(['de', 'en', 'fr']),
    practiceName: z.string(),
    doctorName: z.string(),
    specialty: z.string(),
    street: z.string(),
    zipCity: z.string(),
    phone: z.string(),
    phoneMobile: z.string(),
    fax: z.string(),
    email: z.string(),
    hours: z.array(z.object({
      days: z.string(),
      time: z.string(),
    })),
    hoursNote: z.string(),
  }),
});

export const collections = { leistungen, pages, news, settings };
