/* eslint-disable @next/next/no-server-import-in-page */
// export { default } from 'next-auth/middleware'

// export const config = { matcher: ['/dashboard'] }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname === '/signin' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const slug = request.nextUrl.pathname.split('/').pop()
  const url = new URL(`/api/get-url/${slug}`, request.url)
  const slugFetch = await fetch(url)
  if (slugFetch.status === 404) {
    return NextResponse.redirect(request.nextUrl.origin)
  }

  const data = await slugFetch.json()
  if (data.url) {
    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(request.nextUrl.origin)
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }
