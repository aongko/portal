import { createRouter } from './context'
import { z } from 'zod'

export const linkRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.link.findMany()
    },
  })
