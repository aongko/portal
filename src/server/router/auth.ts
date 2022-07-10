import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { getSalt, hashPassword } from '../../utils/hash'
import { createRouter } from './context'

export const authRouter = createRouter()
  .mutation('signup', {
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }),
    resolve: async ({ ctx, input }) => {
      const { email, password } = input
      const salt = getSalt()
      const hash = hashPassword(password, salt)
      const user = await ctx.prisma.credentialAccount.create({
        data: {
          email,
          password: hash,
          salt,
        },
      })
      return {
        ...user,
        password: password,
      }
    },
  })
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next()
  })
  .query('getSecretMessage', {
    async resolve({ ctx }) {
      return 'You are logged in and can see this secret message!'
    },
  })
