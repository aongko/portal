import Link from 'next/link'
import { useState } from 'react'
import DashboardLayout from '../../components/applayout/dashboard'
import { trpc } from '../../utils/trpc'

type FormCreateProps = {
  onCreate: () => void
}

const FormCreate = (props: FormCreateProps) => {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [errorUrl, setErrorUrl] = useState('')
  const [errorSlug, setErrorSlug] = useState('')
  const [loading, setLoading] = useState(false)

  const create = trpc.useMutation('link.create', {
    onMutate: async () => {
      setLoading(true)
      setError('')
      setErrorUrl('')
      setErrorSlug('')
    },
    onSuccess() {
      setUrl('')
      setSlug('')
      setLoading(false)

      props.onCreate()
    },
    onError(error) {
      console.log('message:', error.message)
      console.log('data:', error.data?.zodError)
      console.log('shape:', error.shape)
      const errors = error.data?.zodError?.fieldErrors

      if (!errors) {
        setError(error.message)
      } else {
        if (errors.url) {
          setErrorUrl(errors.url.join('\n'))
        }
        if (errors.slug) {
          setErrorSlug(errors.slug.join('\n'))
        }
      }

      setLoading(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    create.mutate({ url, slug })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Create a link</h2>
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
          {errorUrl && <div className="text-red-500">{errorUrl}</div>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="slug" className="font-semibold">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border-2 border-gray-300 px-2 py-1"
            placeholder="Enter slug"
            required
          />
          {errorSlug && <div className="text-red-500">{errorSlug}</div>}
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer border-2 border-gray-300 px-4 py-2 hover:border-gray-800"
          disabled={loading}
        >
          <span className="font-semibold">Save</span>
        </button>

        {error && (
          <div className="mt-4 flex w-full flex-col gap-4">
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
    <DashboardLayout title="Dashboard" description="Manage your short URLs">
      <div className="flex flex-col gap-4">
        <FormCreate onCreate={() => links.refetch()} />

        <div className="flex flex-col gap-2">
          <h2>
            <span className="text-2xl font-semibold">Your links</span>
          </h2>

          {links.data && links.data.length > 0 ? (
            <div className="flex flex-col gap-2">
              {links.data.map((link) => (
                <div
                  key={link.id}
                  className="flex max-w-full items-center justify-between"
                >
                  <Link href={link.slug}>
                    <a className="flex w-64 flex-auto flex-col text-blue-500">
                      <span className="font-semibold">/{link.slug}</span>
                      <span className="truncate text-gray-500">{link.url}</span>
                    </a>
                  </Link>

                  <button
                    onClick={() => deleteLink.mutate({ id: link.id })}
                    className="flex-none bg-red-600 px-4 py-2 text-white"
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
