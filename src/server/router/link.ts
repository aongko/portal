import { createRouter } from './context'
import { z, ZodError } from 'zod'
import { TRPCError } from '@trpc/server'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

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
  .mutation('create', {
    input: z.object({
      url: z.string().url('Must be a valid URL'),
      slug: z
        .string()
        .min(2, 'Slug must be at least 2 characters')
        .max(20, 'Slug must be at most 20 characters'),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' })
      }
      const data = { ...input, ownerId: ctx.session.user.id }
      console.log('data:', data)

      try {
        const res = await ctx.prisma.link.create({
          data,
        })
        return res
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Short URL already used',
            })
          }

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          })
        }
        console.error(error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'oops' })
      }
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not logged in' })
      }
      const { id } = input
      const res = await ctx.prisma.link.delete({
        where: { id },
      })
      return res
    },
  })
