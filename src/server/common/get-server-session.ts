import { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

export const getSession = async (ctx: GetServerSidePropsContext) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions)
}
