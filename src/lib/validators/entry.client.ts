import { z } from 'zod'

export const entryClientSchema = z.object({
  feeling: z.number().min(1).max(5),
  temperature: z.number().nullable().optional(),
  pulse: z.number().nullable().optional(),
  pressureSystolic: z.number().nullable().optional(),
  pressureDiastolic: z.number().nullable().optional(),
  headache: z.boolean(),
  symptoms: z.string().nullable().optional(),
})

export type EntryFormData = z.infer<typeof entryClientSchema>
