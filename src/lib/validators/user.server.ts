import { z } from 'zod'

export const userUpdateSchema = z.object({
  height: z.number().min(50).max(250).nullable().optional(),
  weight: z.number().min(20).max(300).nullable().optional(),
})

export type UserUpdateData = z.infer<typeof userUpdateSchema>
//серверная часть ts для внесения и использования данных рост вес для юзера с мин максом