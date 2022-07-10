import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'
import nodemailer from 'nodemailer'
import { prisma } from '../../../server/db/client'
import { hashPassword } from '../../../utils/hash'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider: { server, from },
      }) => {
        const { host } = new URL(url)

        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        })

        const info = await transport.sendMail({
          from,
          to: email,
          subject: `Sign in to ${host}`,
          text: `Please sign in to ${host} by clicking on the link below:

          ${url}

          If you did not request this, please ignore this email.`,
        })

        console.log('Message sent: %s', info.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      },
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
  },
}

export default NextAuth(authOptions)
