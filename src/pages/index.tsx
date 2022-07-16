import type { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Meta from '../components/applayout/meta'

const Home: NextPage = () => {
  const router = useRouter()

  const { data: session } = useSession({
    required: false,
    onUnauthenticated: () => {
      console.log('index - unauthenticated')
    },
  })

  return (
    <>
      <Meta
        title="Portal - Home"
        description="Generate and manage short URLs easily"
      />

      <div className="flex flex-col min-h-screen justify-center mx-auto sm:max-w-sm">
        <div className="flex flex-col items-center rounded border-gray-800 border-2 px-8 py-12">
          <h1 className="text-3xl font-bold text-center">
            Portal <span className="text-blue-500">.</span>
          </h1>

          <p>Generate Short URL</p>
          <p>/ao -&gt; https://andrew.ongko.dev</p>

          <div className="inline-flex space-x-2 mt-4">
            <Link href="/signin">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Get Started
              </button>
            </Link>

            <button
              type="button"
              disabled
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Donate
            </button>

            {session?.user && (
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
