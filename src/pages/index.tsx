import type { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Meta from '../components/applayout/meta'

const Home: NextPage = () => {
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

      <div className="mx-auto flex min-h-screen flex-col justify-center sm:max-w-sm">
        <div className="flex flex-col items-center rounded border-2 border-gray-800 px-8 py-12">
          <h1 className="text-center text-3xl font-bold">
            Portal<span className="text-blue-500">.</span>
          </h1>

          <p>Generate Short URL</p>
          <p>/ao -&gt; https://andrew.ongko.dev</p>

          <div className="mt-4 inline-flex space-x-2">
            <Link href="/signin">
              <button
                type="button"
                className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              >
                {session?.user ? 'Dashboard' : 'Get Started'}
              </button>
            </Link>

            <button
              type="button"
              disabled
              className="focus:shadow-outline rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-700 focus:outline-none"
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
