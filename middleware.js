import { NextResponse } from 'next/server'

export function middleware(request) {
  const session = request.cookies.get('site_session')
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|api|_next/static|_next/image|favicon\\.ico|icon\\.png|opengraph-image\\.png|.*\\..*).*)'],
}
