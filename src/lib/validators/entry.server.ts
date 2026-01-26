import { z } from 'zod'

export const entryServerSchema = z.object({
  userId: z.string(),
  date: z.preprocess(arg => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
  }, z.date()),
  feeling: z.number().min(1).max(5),
  temperature: z.number().nullable().optional(),
  pulse: z.number().nullable().optional(),
  pressureSystolic: z.number().nullable().optional(),
  pressureDiastolic: z.number().nullable().optional(),
  headache: z.boolean(),
  symptoms: z.string().nullable().optional(),
})

export type EntryServerData = z.infer<typeof entryServerSchema>
