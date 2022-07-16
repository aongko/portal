import Link from 'next/link'
import { useState } from 'react'
import DashboardLayout from '../../components/applayout/dashboard'
import { trpc } from '../../utils/trpc'

type FormCreateProps = {
  onCreate: () => void
}

const FormCreate = (props: FormCreateProps) => {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const create = trpc.useMutation('link.create', {
    onMutate: async () => {
      setLoading(true)
      setError('')
    },
    onSuccess() {
      setUrl('')
      setShortUrl('')
      setLoading(false)

      props.onCreate()
    },
    onError(error) {
      setError(error.message)
      setLoading(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    create.mutate({ url, slug: shortUrl })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-2xl">Create a link</h2>
        <div className="flex flex-col">
          <label htmlFor="url" className="font-semibold">
            URL
          </label>
          <input
            type="text"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-2 border-gray-300 px-2 py-1"
            placeholder="Enter your URL"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="shortUrl" className="font-semibold">
            Short URL
          </label>
          <input
            type="text"
            name="shortUrl"
            id="shortUrl"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            className="border-2 border-gray-300 px-2 py-1"
            placeholder="Enter short URL"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 w-full cursor-pointer border-2 border-gray-300 hover:border-gray-800"
          disabled={loading}
        >
          <span className="font-semibold">Shorten</span>
        </button>

        {error && (
          <div className="flex flex-col gap-4 mt-4 w-full">
            <div className="text-red-500">{error}</div>
          </div>
        )}
      </div>
    </form>
  )
}

const DashboardHome = () => {
  // fetch list of links
  const links = trpc.useQuery(['link.getAll'])

  const deleteLink = trpc.useMutation('link.delete', {
    onMutate: (variables) => {
      console.log('deleting link', variables)
    },
    onSuccess: () => {
      console.log('link deleted')
      links.refetch()
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  return (
    <DashboardLayout
      title="Portal - Dashboard"
      description="Manage your short URLs"
    >
      <div className="flex flex-col gap-4">
        <FormCreate onCreate={() => links.refetch()} />

        <div className="flex flex-col gap-2">
          <h2>
            <span className="font-semibold text-2xl">Your links</span>
          </h2>

          {links.data && links.data.length > 0 ? (
            <div className="flex flex-col gap-2">
              {links.data.map((link) => (
                <div
                  key={link.id}
                  className="flex justify-between items-center"
                >
                  <Link href={link.url}>
                    <a className="text-blue-500">
                      <div className="flex flex-col">
                        <span className="font-semibold">/{link.slug}</span>
                        <span className="text-gray-500">{link.url}</span>
                      </div>
                    </a>
                  </Link>

                  <button
                    onClick={() => deleteLink.mutate({ id: link.id })}
                    className="px-4 py-2 bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-gray-500">No links yet</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardHome
