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
    <div className="flex flex-col min-h-screen justify-center mx-auto my-auto w-64">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Sign in</h1>

        <div className="flex flex-col gap-4 mt-4 w-full">
          <button
            className="px-6 py-2 flex items-center text-left cursor-pointer border-2 gap-2"
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
            className="px-6 py-2 flex items-center text-left cursor-pointer border-2 gap-2"
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

        <div className="flex flex-col mt-4 pt-2 w-full items-center border-t-2 border-gray-300">
          <h2>
            <span className="font-semibold text-gray-500">Or</span>
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSignin()
            }}
            className="w-full flex flex-col gap-2"
          >
            {error && (
              <div className="flex flex-col gap-4 mt-4 w-full">
                <div className="text-red-500">{error}</div>
              </div>
            )}

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                name="email"
                className="px-2 py-1 border-2 border-gray-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                name="password"
                className="px-2 py-1 border-2 border-gray-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 w-full cursor-pointer border-2 border-gray-300 hover:border-gray-800"
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
