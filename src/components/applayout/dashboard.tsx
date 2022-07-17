import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Meta from './meta'

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

const DashboardLayout: React.FC<Props> = (props) => {
  const { data: session } = useSession()

  return (
    <>
      <Meta title={`Portal - ${props.title}`} description={props.description} />

      <div className="mx-auto flex min-h-screen min-w-fit max-w-sm flex-col border-2 border-slate-200">
        <div className="border-b-2 border-slate-200">
          <div className="min-w-full py-2 px-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                <Link href="/">Portal</Link> » {props.title}
              </h1>
            </div>
            {session?.user && (
              <div className="flex flex-row items-center justify-between">
                {session.user.email}

                <button
                  type="button"
                  className=" border-2 border-gray-300 px-4 py-1 hover:border-gray-800"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 px-2">{props.children}</div>
      </div>
    </>
  )
}

export default DashboardLayout
