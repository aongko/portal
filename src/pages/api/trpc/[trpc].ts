// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { ZodError } from 'zod'
import { appRouter } from '../../../server/router'
import { createContext } from '../../../server/router/context'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  onError: ({ error }) => {
    if (error.cause && error.cause instanceof ZodError) {
      const e = error.cause.flatten().fieldErrors
      error.message = JSON.stringify(e, null, 2)
    }
  },
})
