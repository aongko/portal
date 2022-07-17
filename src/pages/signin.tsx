import { GetServerSidePropsContext, NextPage } from 'next'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { getSession } from '../server/common/get-server-session'

const SignInPage: NextPage = () => {
  const router = useRouter()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string>(router.query['error'] as string)

  const handleSignin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      setError('Please fill in all fields')
      return
    }

    const email = emailRef.current.value
    const password = passwordRef.current.value

    signIn('credentials', { email, password, redirect: true })
  }

  return (
    <div className="mx-auto my-auto flex min-h-screen w-64 flex-col justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Sign in</h1>

        <div className="mt-4 flex w-full flex-col gap-4">
          <button
            className="flex cursor-pointer items-center gap-2 border-2 px-6 py-2 text-left"
            onClick={() => signIn('github')}
          >
            <Image
              src="/github.png"
              width={20}
              height={20}
              alt="Sign in with Github"
            />
            <span className="font-semibold">Sign in with Github</span>
          </button>
          <button
            className="flex cursor-pointer items-center gap-2 border-2 px-6 py-2 text-left"
            onClick={() => {
              alert('not available')
            }}
          >
            <Image
              src="/google.svg"
              width={20}
              height={20}
              alt="Sign in with Google"
            />
            <span className="font-semibold">Sign in with Google</span>
          </button>
        </div>

        <div className="mt-4 flex w-full flex-col items-center border-t-2 border-gray-300 pt-2">
          <h2>
            <span className="font-semibold text-gray-500">Or</span>
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSignin()
            }}
            className="flex w-full flex-col gap-2"
          >
            {error && (
              <div className="mt-4 flex w-full flex-col gap-4">
                <div className="text-red-500">{error}</div>
              </div>
            )}

            <div className="flex w-full flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                name="email"
                className="border-2 border-gray-300 px-2 py-1"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex w-full flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                name="password"
                className="border-2 border-gray-300 px-2 py-1"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer border-2 border-gray-300 px-4 py-2 hover:border-gray-800"
              onClick={() => handleSignin()}
            >
              <span className="font-semibold">Sign in</span>
            </button>
          </form>

          <p className="text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/signup">
              <a className="text-blue-500 hover:text-blue-700">Sign up</a>
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            {'Forgot your password? '}
            <a
              href="#"
              onClick={() => router.push('/forgot-password')}
              className="text-blue-500 hover:text-blue-700"
            >
              Reset password
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession(context)

  if (session) {
    console.log('signin - getServerSideProps - session', session)
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

export default SignInPage
