import { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { trpc } from '../utils/trpc'
import { authOptions } from './api/auth/[...nextauth]'

const SignUpPage = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string>('')
  const mutation = trpc.useMutation(['auth.signup'], {
    onError(error, _variables, _context) {
      if (error.message.includes('too_small')) {
        setError('Password must be at least 8 characters')
        return
      }

      setError(error.message)
    },
    onSuccess(data, _variables, _context) {
      console.log(data)
      setError('')

      signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
      })
    },
  })

  const handleSignup = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !passwordConfirmRef.current
    ) {
      setError('Please fill in all fields')
      return
    }

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const passwordConfirm = passwordConfirmRef.current.value

    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return
    }

    // use mutation
    mutation.mutate({ email, password })
  }

  return (
    <div className="mx-auto my-auto flex min-h-screen w-64 flex-col justify-center space-y-2">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Sign up</h1>

        {error && (
          <div className="mt-4 flex w-full flex-col space-y-4">
            <div className="text-red-500">{error}</div>
          </div>
        )}

        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              className="border-2 border-gray-300 p-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              name="password"
              className="border-2 border-gray-300 p-2"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="passwordConfirm" className="text-sm font-semibold">
              Confirm password
            </label>
            <input
              ref={passwordConfirmRef}
              type="password"
              name="passwordConfirm"
              className="border-2 border-gray-300 p-2"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer items-center border-2 p-2"
            onClick={() => handleSignup()}
            disabled={mutation.isLoading}
          >
            <span className="font-semibold">Sign up</span>
          </button>
        </div>

        <p className="text-sm text-gray-600">
          {'Already have an account? '}
          <Link href="/signin">
            <a className="text-blue-500 hover:text-blue-700">Sign in</a>
          </Link>
        </p>
      </div>
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  )

  if (session) {
    console.log('signup - getServerSideProps - session', session)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default SignUpPage
