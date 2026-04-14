import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request) {
  // LOGIN WALL DEZACTIVAT TEMPORAR — de reactivat după App Review Facebook
  // const session = request.cookies.get('site_session')
  // if (!session) {
  //   const loginUrl = new URL('/login', request.url)
  //   return NextResponse.redirect(loginUrl)
  // }

  // Supabase Auth — protecție pentru /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|api|_next/static|_next/image|favicon\\.ico|icon\\.png|opengraph-image\\.png|.*\\..*).*)'],
}
