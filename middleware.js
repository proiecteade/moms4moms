import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('site_session')

  if (!session && pathname !== '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (session && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
