import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Meta from './meta'

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

const DashboardLayout = (props: Props) => {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    // onUnauthenticated: () => router.push('/'),
    onUnauthenticated: async () => {
      console.log('status:', status)
      console.log('user:', session?.user)
      await router.push('/signin')
    },
  })

  return (
    <>
      <Meta title={`Portal - ${props.title}`} description={props.description} />

      <div className="flex flex-col min-h-screen mx-auto sm:max-w-sm border-2 border-slate-200">
        <div className="border-b-2 border-slate-200">
          <div className="min-w-full py-2 px-4">
            <h1 className="text-xl font-semibold">{props.title}</h1>

            {session?.user && (
              <div className="flex flex-row justify-between items-center">
                {session.user.email}

                <button
                  type="button"
                  className=" px-4 py-1 border-2 border-gray-300 hover:border-gray-800"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 px-2">
          <p>Status: {status}</p>
          {props.children}
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
