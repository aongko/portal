import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import nodemailer from 'nodemailer'
import { prisma } from '../../../server/db/client'
import { hashPassword } from '../../../utils/hash'
import { env } from '../../../env/server-env.mjs'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email address',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.credentialAccount.findFirst({
          where: {
            email: credentials?.email,
          },
        })

        if (!user) {
          console.error('email not found')
          throw new Error('Invalid email or password')
        }

        const hashedPassword = hashPassword(credentials.password, user.salt)
        if (hashedPassword !== user.password) {
          console.error('wrong password')
          throw new Error('Invalid email or password')
        }

        const userData = { id: user.id, name: '', email: user.email }
        return userData
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 86400,
    updateAge: 3600,
  },
  callbacks: {
    jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    session({ session, user, token }) {
      if (session.user) {
        if (user?.id) session.user.id = user.id
        if (token?.sub) session.user.id = token.sub
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
