// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { linkRouter } from './link'
import { authRouter } from './auth'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('link.', linkRouter)
  .merge('auth.', authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
