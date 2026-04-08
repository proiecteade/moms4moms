import { NextResponse } from 'next/server'

export async function POST(request) {
  const { username, password } = await request.json()
  const validUser = process.env.SITE_USERNAME || 'admin'
  const validPass = process.env.SITE_PASSWORD || 'momsmoms'

  if (username === validUser && password === validPass) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('site_session', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  }
  return NextResponse.json({ error: 'Credențiale incorecte.' }, { status: 401 })
}
