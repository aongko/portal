import type { NextPage } from 'next'
import Meta from '../components/meta'

const Home: NextPage = () => {
  const handleGetStarted = async () => {
    alert('get started')
  }

  return (
    <>
      <Meta
        title="Portal - Home"
        description="Generate and manage short URLs easily"
      />

      <div className="flex flex-col justify-center min-h-screen mx-auto sm:max-w-sm">
        <div className="flex flex-col items-center rounded border-gray-800 border-2 px-8 py-12">
          <h1 className="text-3xl font-bold text-center">
            Portal <span className="text-blue-500">.</span>
          </h1>

          <p>Generate Short URL</p>
          <p>/ao -&gt; https://andrew.ongko.dev</p>

          <div className="inline-flex space-x-2 mt-4">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleGetStarted}
            >
              Get Started
            </button>

            <button
              type="button"
              disabled
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
