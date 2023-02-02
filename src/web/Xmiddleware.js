// import getLoginInfo from './functions/getLoginInfo'
import { NextResponse } from 'next/server'

const admins = JSON.parse(process.env.WEB_ADMINS)

export default async function middleware(req) {
  // const x = await getLoginInfo(req)
  // console.log(req.headers.cookie)
  const url = req.nextUrl.pathname
  const password = req.cookies.get('vpac-password')?.value
  
  // Prevent users without the correct password cookie from going to /admin.
  if (url == '/login') {
    if (!admins.includes(password)) return
    return NextResponse.redirect(new URL('/admin', req.url))
  }
  else if (url == '/admin') {
    if (admins.includes(password)) return
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Make middleware ignore all /api/ routes.
// This is due to a bug where middleware stalls
// all requests larger than 64 KB.
export const config = {
  matcher: ['/((?!api).*)'],
}