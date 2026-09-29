import { z } from 'zod'
import { routing } from '@/i18n/routing'

export const localeSchema = z.enum(routing.locales)

export const localizedStringSchema = z.object({
  de: z.string().min(1),
  en: z.string().min(1),
})

export const projectSchema = z.object({
  slug: z.string().min(1),
  title: localizedStringSchema,
  summary: localizedStringSchema,
  role: localizedStringSchema,
  year: z.string().min(1),
  stack: z.array(z.string()).min(1),
  featured: z.boolean(),
  coverUrl: z.string().min(1),
  links: z.array(
    z.object({
      label: localizedStringSchema,
      url: z.string().url(),
    }),
  ),
  body: localizedStringSchema,
  highlights: z.array(localizedStringSchema),
})

export type ProjectDto = z.infer<typeof projectSchema>
